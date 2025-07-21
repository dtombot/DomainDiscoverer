import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";

const AFFILIATE_LINK = "https://www.namecheap.com/?affid=000000";
const SIGNUP_URL = "/signup"; // Adjust if needed

export default function Home() {
  // State for domain search
  const [domain, setDomain] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [ctaVisible, setCtaVisible] = useState(false);

  // Domains Data
  const [expiring, setExpiring] = useState([]);
  const [handreg, setHandreg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);

  // For subscription modal
  const [showSubModal, setShowSubModal] = useState(false);
  const [subModalType, setSubModalType] = useState("expiring"); // or 'handreg'

  // Domaining Tools & Recent Sales (dynamic from db)
  const [domainingTools, setDomainingTools] = useState([]);
  const [recentSales, setRecentSales] = useState([]);

  // For the animated ticker (recent sales)
  const tickerRef = useRef();

  // ---- Data fetching (expiring/handreg/tools/sales) ----
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/.netlify/functions/get-domains?list=expiring").then(r => r.json()),
      fetch("/.netlify/functions/get-domains?list=handreg").then(r => r.json()),
      supabase.from("dd_domaining_tools").select("*").order("inserted_at", { ascending: false }),
      supabase.from("dd_recent_sales").select("*").order("inserted_at", { ascending: false }),
    ]).then(([exp, hand, tools, sales]) => {
      setExpiring(exp.domains || []);
      setHandreg(hand.domains || []);
      setDomainingTools(tools.data || []);
      setRecentSales(sales.data || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      setExpiring([]);
      setHandreg([]);
      setDomainingTools([]);
      setRecentSales([]);
    });
  }, []);

  // ---- Check availability for handreg ideas ----
  useEffect(() => {
    handreg.slice(0, 10).forEach((d) => {
      const name = d?.domain;
      if (!name) return;
      const key = name.toLowerCase();
      if (!availabilityMap[key]) {
        fetch(`/.netlify/functions/check-domain?domain=${key}`)
          .then(res => res.json())
          .then(avail => {
            setAvailabilityMap(map => ({
              ...map,
              [key]: { status: avail.status }
            }));
          })
          .catch(() => {
            setAvailabilityMap(map => ({
              ...map,
              [key]: { status: "error" }
            }));
          });
      }
    });
    // eslint-disable-next-line
  }, [handreg]);

  // ---- Domain availability check (for hero search) ----
  const checkDomain = async (e) => {
    e.preventDefault();
    if (!domain) return;
    setStatus("checking");
    setMessage("");
    setCtaVisible(false);
    try {
      const domainLc = domain.toLowerCase();
      const res = await fetch(`/.netlify/functions/check-domain?domain=${domainLc}`);
      const data = await res.json();
      if (data.status === "available") {
        setStatus("available");
        setMessage("🎉 Domain is AVAILABLE!");
        setCtaVisible(true);
      } else if (data.status === "taken") {
        setStatus("taken");
        setMessage("❌ Domain is already registered.");
        setCtaVisible(false);
      } else {
        setStatus("error");
        setMessage(data.message || "Error checking domain.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  };

  // ---- Domain details modal ----
  const openModal = (domain) => { setSelectedDomain(domain); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setSelectedDomain(null); };

  // ---- Expiring domain card ----
  const renderExpiringDomain = (d, idx) => {
    if (!d?.domain) return null;
    return (
      <li
        key={d.domain + idx}
        className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-xl shadow-xl flex flex-col justify-center items-center text-center px-4 py-2 my-1 mx-auto w-full min-h-[56px] hover:scale-[1.025] hover:bg-primary/20 transition cursor-pointer"
        onClick={() => openModal(d)}
      >
        <span className="font-mono font-bold text-base text-primary">{d.domain}</span>
        {d.value && <span className="mt-1 text-xs text-secondary font-semibold">Est. Value: ${d.value}</span>}
      </li>
    );
  };

  // ---- Handreg domain card ----
  const renderHandregDomain = (d, idx) => {
    if (!d?.domain) return null;
    const key = d.domain.toLowerCase();
    const avail = availabilityMap[key] || {};
    let statusText = "";
    let statusColor = "text-gray-500";
    let icon = "⏳";
    if (avail.status === "available") {
      statusText = "Available";
      statusColor = "text-green-700";
      icon = "✅";
    } else if (avail.status === "taken") {
      statusText = "Taken";
      statusColor = "text-red-600";
      icon = "❌";
    } else if (avail.status) {
      statusText = "Unknown";
      statusColor = "text-gray-400";
      icon = "❓";
    } else {
      statusText = "Checking...";
    }
    return (
      <li
        key={d.domain + idx}
        className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-xl shadow-xl flex flex-col justify-center items-center text-center px-4 py-2 my-1 mx-auto w-full min-h-[56px] hover:scale-[1.025] hover:bg-secondary/20 transition cursor-pointer"
        onClick={() => openModal(d)}
      >
        <span className="font-mono font-bold text-base text-primary">{d.domain}</span>
        <span className="flex flex-row items-center justify-center gap-3 mt-1 w-full">
          {d.value && (
            <span className="text-xs text-secondary font-semibold">
              Est. Value: ${d.value}
            </span>
          )}
          <span className={`text-xs font-normal ${statusColor}`}>
            {icon} {statusText}
          </span>
        </span>
      </li>
    );
  };

  // ---- Domain details modal ----
  const renderDomainModal = () =>
    selectedDomain && (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
      >
        <motion.div
          className="bg-white rounded-3xl p-10 shadow-2xl w-full max-w-md relative"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-lg bg-gray-200 hover:bg-secondary rounded-full w-8 h-8 flex items-center justify-center"
            onClick={closeModal}
            aria-label="Close"
          >×</button>
          <h3 className="text-xl font-bold text-primary mb-2">
            {selectedDomain.domain}
          </h3>
          <div className="mb-2 text-primary">
            <strong>Value:</strong> ${selectedDomain.value || "N/A"}<br />
          </div>
          {/* Placeholder for Wayback snapshot */}
          <div className="my-4">
            <div className="font-semibold mb-1 text-primary">Wayback Machine Preview</div>
            <div className="w-full bg-gray-200 rounded-lg h-32 flex items-center justify-center text-gray-500">
              <span>Wayback snapshot preview here</span>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-4">
            <em>
              More metrics (backlinks, SEO, history) coming soon.<br />
              <span className="text-xs text-gray-400">You can suggest what you'd like to see here!</span>
            </em>
          </div>
        </motion.div>
      </motion.div>
    );

  // ---- Marquee ticker for sales ----
  const tickerWidth = 220 * recentSales.length;
  const tickerContent = (
    <div className="flex items-center gap-8" style={{ width: tickerWidth }}>
      {recentSales.map((sale, i) => (
        <div key={sale.id || i} className="flex-shrink-0 flex flex-col md:flex-row md:items-center bg-white/90 px-4 py-2 rounded-xl shadow border border-accent">
          <span className="text-primary font-bold mr-2">{sale.domain}</span>
          <span className="text-green-700 font-semibold">{sale.price}</span>
          <span className="mx-1 text-gray-400">on</span>
          <span className="text-secondary">{sale.platform}</span>
          <span className="ml-2 text-gray-400 text-xs">{sale.date}</span>
        </div>
      ))}
    </div>
  );
  // ---- Marquee animation ----
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let id;
    const step = () => {
      setOffset(prev => (prev <= -tickerWidth ? 0 : prev - 1.5));
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [tickerWidth]);

  // ---- Subscription Modal ----
  const renderSubModal = () => (
    <motion.div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowSubModal(false)}
    >
      <motion.div
        className="bg-white rounded-3xl p-10 shadow-2xl w-full max-w-md relative text-center"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-lg bg-gray-200 hover:bg-secondary rounded-full w-8 h-8 flex items-center justify-center"
          onClick={() => setShowSubModal(false)}
          aria-label="Close"
        >×</button>
        <h2 className="text-2xl font-bold mb-3 text-primary">Subscribe to unlock full access</h2>
        <div className="mb-3 text-secondary">
          See the full list of {subModalType === "expiring" ? "expiring domains" : "handreg ideas"} and never miss an opportunity!
        </div>
        <div className="text-lg font-bold text-primary mb-3">
          Only <span className="text-green-600">$4.20</span> per month
        </div>
        <a
          href={SIGNUP_URL}
          className="inline-block px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-2xl shadow hover:scale-105 transition mt-2"
        >
          Subscribe Now
        </a>
        <div className="text-xs mt-4 text-gray-400">Cancel anytime. Subscribers enjoy premium domaining tools and data.</div>
      </motion.div>
    </motion.div>
  );

  // ---- Main UI ----
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2 sm:px-6 text-center bg-gradient-to-b from-primary to-secondary pt-24">

      {/* --- HERO SECTION --- */}
      <section className="mb-14 w-full max-w-2xl mx-auto">
        <motion.h1
          className="text-4xl sm:text-6xl font-extrabold mb-3 text-white drop-shadow-xl font-sans"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Find Your Next <span className="text-secondary">Valuable Domain</span>
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-accent mb-7 text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Search, discover, and grab top domains before anyone else.
        </motion.p>
        <form
          className="flex w-full max-w-md gap-2 mx-auto"
          onSubmit={checkDomain}
          autoComplete="off"
        >
          <input
            type="text"
            required
            placeholder="e.g. smartmininghub.com"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            className="flex-1 px-4 py-3 rounded-l-2xl bg-primary text-white border-2 border-secondary focus:outline-none focus:border-accent placeholder-gray-400 font-medium transition text-base"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-r-2xl font-bold bg-secondary text-primary hover:bg-primary hover:text-secondary border-2 border-secondary transition"
            disabled={status === "checking"}
          >
            {status === "checking" ? "Checking..." : "Check"}
          </button>
        </form>
        {message && (
          <motion.div
            className={`mt-4 text-lg font-semibold ${
              status === "available"
                ? "text-green-400"
                : status === "taken"
                ? "text-red-400"
                : "text-red-300"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.div>
        )}
        {/* Affiliate CTA button appears ONLY if available */}
        {status === "available" && (
          <a
            href={AFFILIATE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block px-7 py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-2xl shadow hover:scale-105 transition text-base"
          >
            Register this domain now
          </a>
        )}
        <div className="mt-4 text-sm text-white/80">
          <span className="font-semibold">Find your next great brand before others do.</span>
        </div>
      </section>

      {/* --- DOMAINS GRID: EXPIRING + HANDREG IDEAS --- */}
      <section className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {/* Expiring This Week */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-xl flex flex-col min-h-[340px] border border-accent"
        >
          <div className="text-xl font-bold mb-2 text-primary flex items-center gap-2 font-sans justify-center text-center">⏳ Expiring This Week</div>
          <ul className="flex-1 flex flex-col justify-center">
            {loading
              ? <li className="text-gray-400">Loading...</li>
              : expiring.slice(0,5).map((d, i) => renderExpiringDomain(d, i))
            }
          </ul>
          <button
            className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow hover:scale-105 transition"
            onClick={() => { setShowSubModal(true); setSubModalType("expiring"); }}
          >
            See More Expiring Domains
          </button>
        </motion.div>
        {/* Handreg Ideas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-xl flex flex-col min-h-[340px] border border-accent"
        >
          <div className="text-xl font-bold mb-2 text-primary flex items-center gap-2 font-sans justify-center text-center">💡 Handreg Ideas</div>
          <ul className="flex-1 flex flex-col justify-center">
            {loading
              ? <li className="text-gray-400">Loading...</li>
              : handreg.slice(0,5).map((d, i) => renderHandregDomain(d, i))
            }
          </ul>
          <button
            className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-semibold shadow hover:scale-105 transition"
            onClick={() => { setShowSubModal(true); setSubModalType("handreg"); }}
          >
            See More Handreg Ideas
          </button>
        </motion.div>
      </section>

      {/* --- DOMAINING TOOLS GALLERY (from DB) --- */}
      <section className="w-full max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-6 text-white font-sans">🧰 Domaining Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {domainingTools.map((tool, i) => (
            <a
              key={tool.id || i}
              href={tool.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square w-full bg-white rounded-xl shadow hover:shadow-lg hover:scale-[1.04] transition border border-accent p-0 overflow-hidden relative flex items-stretch group"
              tabIndex={0}
              aria-label={tool.name}
            >
              <img
                src={tool.img}
                alt={tool.name}
                className="w-full h-full object-cover group-hover:opacity-85 transition"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white/80 text-primary text-xs font-bold text-center py-2">
                {tool.name}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* --- RECENT SALES TICKER (from DB) --- */}
      <section className="w-full max-w-4xl mx-auto mb-14">
        <h2 className="text-2xl font-bold mb-6 text-white font-sans">💰 Recent Interesting Sales</h2>
        <div className="w-full overflow-x-hidden border border-accent bg-white/90 rounded-xl shadow h-16 flex items-center">
          <div
            ref={tickerRef}
            className="flex items-center"
            style={{
              transform: `translateX(${offset}px)`,
              width: tickerWidth * 2, // repeated
              willChange: "transform",
            }}
          >
            {tickerContent}
            {tickerContent}
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">*Sales data refreshed daily from public sources.</div>
      </section>

      {/* --- FAQ SECTION (Last before footer) --- */}
      <section className="w-full max-w-3xl mx-auto mb-14">
        <h2 className="text-2xl font-bold mb-6 text-white font-sans">FAQ</h2>
        <div className="space-y-5 text-left">
          <details className="bg-white rounded-2xl p-5 shadow transition hover:shadow-lg">
            <summary className="font-bold cursor-pointer text-primary">What is Domain Investing?</summary>
            <div className="mt-2 text-primary">
              Domain investing is the business of acquiring, holding, and selling domain names for a profit. Domainers identify names with future value or potential for end-users and list or sell them through various platforms.
            </div>
          </details>
          <details className="bg-white rounded-2xl p-5 shadow transition hover:shadow-lg">
            <summary className="font-bold cursor-pointer text-primary">Why do domain names have value?</summary>
            <div className="mt-2 text-primary">
              A good domain is short, memorable, brandable, and often uses a top TLD like .com. Businesses and startups pay a premium for names that make them look credible and attract more customers.
            </div>
          </details>
          <details className="bg-white rounded-2xl p-5 shadow transition hover:shadow-lg">
            <summary className="font-bold cursor-pointer text-primary">How often are lists updated?</summary>
            <div className="mt-2 text-primary">
              We refresh all lists daily with the latest expiring and handreg names so you never miss an opportunity.
            </div>
          </details>
          <details className="bg-white rounded-2xl p-5 shadow transition hover:shadow-lg">
            <summary className="font-bold cursor-pointer text-primary">Is domain investing risky?</summary>
            <div className="mt-2 text-primary">
              Like all investments, there’s some risk. Many names may never resell, so always research comparable sales and trends before purchasing.
            </div>
          </details>
          <details className="bg-white rounded-2xl p-5 shadow transition hover:shadow-lg">
            <summary className="font-bold cursor-pointer text-primary">How do I buy a domain from your lists?</summary>
            <div className="mt-2 text-primary">
              For expiring names, register through any major registrar after drop. For handreg ideas, simply use the affiliate link after checking availability.
            </div>
          </details>
        </div>
      </section>

      {/* --- DOMAINING TIPS & STRATEGIES --- */}
      <section className="w-full max-w-3xl mx-auto mb-20">
        <h2 className="text-2xl font-bold mb-6 text-white font-sans">📚 Domaining Tips & Strategies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-white rounded-2xl p-5 shadow text-primary"> <b>Tip:</b> Short, pronounceable .com domains usually command the highest resale value.</div>
          <div className="bg-white rounded-2xl p-5 shadow text-primary"> <b>Tip:</b> Use domain auctions, drops, and handregs to build a diverse portfolio.</div>
          <div className="bg-white rounded-2xl p-5 shadow text-primary"> <b>Strategy:</b> Focus on one-word and two-word brandables—avoid complex or trademarked names.</div>
          <div className="bg-white rounded-2xl p-5 shadow text-primary"> <b>Strategy:</b> Research recent comparable sales and end-users before pricing a domain.</div>
        </div>
      </section>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {modalOpen && renderDomainModal()}
        {showSubModal && renderSubModal()}
      </AnimatePresence>
    </div>
  );
}
