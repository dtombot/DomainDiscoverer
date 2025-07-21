import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const TABS = [
  { label: "Expiring", key: "expiring" },
  { label: "Handreg", key: "handreg" },
  { label: "Domaining Tools", key: "tools" },
  { label: "Recent Sales", key: "sales" },
  { label: "Analytics", key: "analytics" },
];

// Helper to clean form data (only send fields that are allowed and not empty)
function cleanForm(form, allowed) {
  const cleaned = {};
  allowed.forEach(key => {
    if (form[key] !== undefined && form[key] !== "") cleaned[key] = form[key];
  });
  return cleaned;
}

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("expiring");
  const [lists, setLists] = useState({
    expiring: [],
    handreg: [],
    tools: [],
    sales: [],
  });
  const [loading, setLoading] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  // Form state
  const [form, setForm] = useState({});
  const [editIdx, setEditIdx] = useState(null);

  // Analytics
  const [stats, setStats] = useState({});

  // Bulk Add modal state
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkMsg, setBulkMsg] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkPreview, setBulkPreview] = useState([]);
  const [csvFile, setCsvFile] = useState(null);

  // Bulk Delete state
  const [selectedIds, setSelectedIds] = useState([]);

  // Check admin login
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return setForbidden(true);
      const { data, error } = await supabase
        .from("dd_users")
        .select("role")
        .eq("email", user.email)
        .single();
      if (!error && data && data.role === "admin") {
        setUser(user);
      } else {
        setForbidden(true);
      }
    });
  }, []);

  // Load lists
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const [exp, han, tools, sales] = await Promise.all([
        supabase.from("dd_expiring_domains").select("*").order("inserted_at", { ascending: false }),
        supabase.from("dd_handreg_domains").select("*").order("inserted_at", { ascending: false }),
        supabase.from("dd_domaining_tools").select("*").order("inserted_at", { ascending: false }),
        supabase.from("dd_recent_sales").select("*").order("inserted_at", { ascending: false }),
      ]);
      setLists({
        expiring: exp.data || [],
        handreg: han.data || [],
        tools: tools.data || [],
        sales: sales.data || [],
      });
      setLoading(false);
      setSelectedIds([]);
    };
    fetchData();
    // eslint-disable-next-line
  }, [user]);

  // Analytics
  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const res1 = await supabase.from("dd_expiring_domains").select("id", { count: "exact", head: true });
      const res2 = await supabase.from("dd_handreg_domains").select("id", { count: "exact", head: true });
      setStats({
        expiring: res1.count,
        handreg: res2.count,
      });
    };
    fetchStats();
    // eslint-disable-next-line
  }, [user, lists]);

  // Form fields per tab
  const FIELDS = {
    expiring: [
      { name: "domain", label: "Domain", type: "text" },
      { name: "tld", label: "TLD", type: "text" },
      { name: "age", label: "Age", type: "number" },
      { name: "value", label: "Value", type: "number" },
    ],
    handreg: [
      { name: "domain", label: "Domain", type: "text" },
      { name: "tld", label: "TLD", type: "text" },
      { name: "tag", label: "Tag", type: "text" },
      { name: "value", label: "Value", type: "number" },
    ],
    tools: [
        { name: "name", label: "Tool Name", type: "text" },
        { name: "img", label: "Image Path", type: "text", placeholder: "/domainingtools/namebio.jpg" },
        { name: "link", label: "Affiliate/External Link", type: "text", placeholder: "https://affiliate.com/tool" },
    ],
    sales: [
      { name: "domain", label: "Domain", type: "text" },
      { name: "price", label: "Price", type: "text" },
      { name: "platform", label: "Platform", type: "text" },
      { name: "date", label: "Date", type: "text" },
    ],
  };

  // --- CRUD Handlers ---

  const handleTab = (key) => {
    setActiveTab(key);
    setEditIdx(null);
    setForm({});
    setSelectedIds([]);
  };

  // Add/Edit item
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const table =
      activeTab === "expiring"
        ? "dd_expiring_domains"
        : activeTab === "handreg"
        ? "dd_handreg_domains"
        : activeTab === "tools"
        ? "dd_domaining_tools"
        : "dd_recent_sales";
    const allowed = FIELDS[activeTab].map(f => f.name);
    const cleanedForm = cleanForm(form, allowed);
    let res;
    if (editIdx !== null) {
      // Update
      const id = lists[activeTab][editIdx].id;
      res = await supabase.from(table).update(cleanedForm).eq("id", id);
    } else {
      // Add
      res = await supabase.from(table).insert([cleanedForm]);
    }
    // Refresh list
    const all = await supabase.from(table).select("*").order("inserted_at", { ascending: false });
    setLists((prev) => ({ ...prev, [activeTab]: all.data || [] }));
    setForm({});
    setEditIdx(null);
    setLoading(false);
    setSelectedIds([]);
  };

  // Delete item (single)
  const handleDelete = async (idx) => {
    setLoading(true);
    const table =
      activeTab === "expiring"
        ? "dd_expiring_domains"
        : activeTab === "handreg"
        ? "dd_handreg_domains"
        : activeTab === "tools"
        ? "dd_domaining_tools"
        : "dd_recent_sales";
    const id = lists[activeTab][idx].id;
    await supabase.from(table).delete().eq("id", id);
    const all = await supabase.from(table).select("*").order("inserted_at", { ascending: false });
    setLists((prev) => ({ ...prev, [activeTab]: all.data || [] }));
    setLoading(false);
    setSelectedIds([]);
  };

  // Bulk Delete (Expiring/Handreg only)
  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    setLoading(true);
    const table =
      activeTab === "expiring"
        ? "dd_expiring_domains"
        : "dd_handreg_domains";
    await supabase.from(table).delete().in("id", selectedIds);
    const all = await supabase.from(table).select("*").order("inserted_at", { ascending: false });
    setLists((prev) => ({ ...prev, [activeTab]: all.data || [] }));
    setLoading(false);
    setSelectedIds([]);
  };

  // Start edit
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setForm(lists[activeTab][idx]);
    setSelectedIds([]);
  };

  // --- Bulk Add Helpers (only Expiring/Handreg) ---

  const parseCsv = (text) => {
    let lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
    if (!lines.length) return [];
    let header = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ''));
    let rows = lines.slice(1).map(line =>
      line.split(",").map(x => x.trim().replace(/^"|"$/g, ''))
    );
    return rows.map(cols => {
      let row = {};
      header.forEach((h, i) => {
        row[h] = cols[i];
      });
      return row;
    });
  };

  const mapBulkData = (data) => {
    if (activeTab === "expiring") {
      return data.map(row => ({
        domain: row["Domain Name"] || row["domain"] || "",
        tld: row["TLD"] || row["tld"] || "",
        age: row["Age"] && !isNaN(Number(row["Age"])) ? Math.round(Number(row["Age"])) : null,
        value: row["Valuation"] && !isNaN(Number(row["Valuation"])) ? Math.round(Number(row["Valuation"])) : null,
      })).filter(r => r.domain);
    }
    // handreg
    return data.map(row => ({
      domain: row["Domain Name"] || row["domain"] || "",
      tld: row["TLD"] || row["tld"] || "",
      tag: row["Tag"] || row["tag"] || "",
      value: row["Valuation"] && !isNaN(Number(row["Valuation"])) ? Math.round(Number(row["Valuation"])) : null,
    })).filter(r => r.domain);
  };

  // --- UI ---

  if (forbidden)
    return (
      <div className="max-w-lg mx-auto mt-32 p-6 bg-white rounded-xl shadow-lg text-red-500 text-center text-lg">
        Forbidden: Only admin can access this page.
      </div>
    );

  if (!user)
    return (
      <div className="max-w-lg mx-auto mt-32 p-6 bg-white rounded-xl shadow-lg text-gray-500 text-center text-lg">
        Loading...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-24 p-4 bg-white rounded-2xl shadow-xl min-h-[80vh]">
      <h1 className="text-2xl font-extrabold text-primary mb-8">Admin Dashboard</h1>
      <div className="flex border-b mb-6 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 font-bold border-b-2 transition ${
              activeTab === tab.key
                ? "border-secondary text-primary"
                : "border-transparent text-gray-400 hover:text-secondary"
            }`}
            onClick={() => handleTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {/* Expiring/Handreg */}
      {(activeTab === "expiring" || activeTab === "handreg") && (
        <div>
          <form onSubmit={handleSubmit} className="flex gap-3 mb-4 flex-wrap">
            {FIELDS[activeTab].map((field) => (
              <input
                key={field.name}
                type={field.type}
                placeholder={field.label}
                required={field.name === "domain"}
                value={form[field.name] || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.name]: field.type === "number" ? Number(e.target.value) : e.target.value,
                  }))
                }
                className="border border-accent rounded-xl px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            ))}
            <button
              type="submit"
              className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-2 rounded-xl shadow hover:scale-105 transition"
              disabled={loading}
            >
              {editIdx !== null ? "Update" : "Add"}
            </button>
            {editIdx !== null && (
              <button
                type="button"
                className="ml-2 px-4 py-2 rounded-xl text-gray-400 border border-accent hover:text-primary"
                onClick={() => {
                  setEditIdx(null);
                  setForm({});
                }}
              >
                Cancel
              </button>
            )}
          </form>
          {/* Bulk Add & Bulk Delete Controls */}
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              className="px-4 py-2 bg-secondary text-primary rounded-lg font-bold hover:bg-primary hover:text-secondary transition"
              onClick={() => setBulkModalOpen(true)}
              type="button"
            >
              Bulk Add
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-bold border ${
                selectedIds.length
                  ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                  : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
              } transition`}
              onClick={handleBulkDelete}
              type="button"
              disabled={!selectedIds.length}
            >
              Delete Selected {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-accent text-left">
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        lists[activeTab].length > 0 &&
                        selectedIds.length === lists[activeTab].length
                      }
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedIds(lists[activeTab].map(item => item.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                    />
                  </th>
                  {FIELDS[activeTab].map((f) => (
                    <th key={f.name} className="py-2 px-3 font-semibold text-primary">
                      {f.label}
                    </th>
                  ))}
                  <th className="py-2 px-3 font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lists[activeTab].map((item, idx) => (
                  <tr key={item.id} className="hover:bg-secondary/20">
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedIds([...selectedIds, item.id]);
                          } else {
                            setSelectedIds(selectedIds.filter(id => id !== item.id));
                          }
                        }}
                      />
                    </td>
                    {FIELDS[activeTab].map((f) => (
                      <td key={f.name} className="py-2 px-3 text-primary">
                        {item[f.name]}
                      </td>
                    ))}
                    <td className="py-2 px-3 flex gap-2">
                      <button
                        className="text-blue-700 font-bold underline"
                        onClick={() => handleEdit(idx)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 font-bold underline"
                        onClick={() => handleDelete(idx)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!lists[activeTab].length && (
                  <tr>
                    <td colSpan={FIELDS[activeTab].length + 2} className="text-gray-400 text-center py-6">
                      No data yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Domaining Tools */}
      {activeTab === "tools" && (
        <div>
          <form onSubmit={handleSubmit} className="flex gap-3 mb-4 flex-wrap">
            {FIELDS[activeTab].map((field) => (
              <input
                key={field.name}
                type={field.type}
                placeholder={field.placeholder || field.label}
                required={field.name === "name"}
                value={form[field.name] || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
                className="border border-accent rounded-xl px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            ))}
            <button
              type="submit"
              className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-2 rounded-xl shadow hover:scale-105 transition"
              disabled={loading}
            >
              {editIdx !== null ? "Update" : "Add"}
            </button>
            {editIdx !== null && (
              <button
                type="button"
                className="ml-2 px-4 py-2 rounded-xl text-gray-400 border border-accent hover:text-primary"
                onClick={() => {
                  setEditIdx(null);
                  setForm({});
                }}
              >
                Cancel
              </button>
            )}
          </form>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-accent text-left">
                  {FIELDS[activeTab].map((f) => (
                    <th key={f.name} className="py-2 px-3 font-semibold text-primary">
                      {f.label}
                    </th>
                  ))}
                  <th className="py-2 px-3 font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lists[activeTab].map((item, idx) => (
                  <tr key={item.id} className="hover:bg-secondary/20">
                    {FIELDS[activeTab].map((f) => (
                      <td key={f.name} className="py-2 px-3 text-primary">
                        {f.name === "img" ? (
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover bg-gray-200"
                          />
                        ) : (
                          item[f.name]
                        )}
                      </td>
                    ))}
                    <td className="py-2 px-3 flex gap-2">
                      <button
                        className="text-blue-700 font-bold underline"
                        onClick={() => handleEdit(idx)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 font-bold underline"
                        onClick={() => handleDelete(idx)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!lists[activeTab].length && (
                  <tr>
                    <td colSpan={FIELDS[activeTab].length + 1} className="text-gray-400 text-center py-6">
                      No tools added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Sales */}
      {activeTab === "sales" && (
        <div>
          <form onSubmit={handleSubmit} className="flex gap-3 mb-4 flex-wrap">
            {FIELDS[activeTab].map((field) => (
              <input
                key={field.name}
                type={field.type}
                placeholder={field.label}
                required={field.name === "domain"}
                value={form[field.name] || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
                className="border border-accent rounded-xl px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            ))}
            <button
              type="submit"
              className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-2 rounded-xl shadow hover:scale-105 transition"
              disabled={loading}
            >
              {editIdx !== null ? "Update" : "Add"}
            </button>
            {editIdx !== null && (
              <button
                type="button"
                className="ml-2 px-4 py-2 rounded-xl text-gray-400 border border-accent hover:text-primary"
                onClick={() => {
                  setEditIdx(null);
                  setForm({});
                }}
              >
                Cancel
              </button>
            )}
          </form>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-accent text-left">
                  {FIELDS[activeTab].map((f) => (
                    <th key={f.name} className="py-2 px-3 font-semibold text-primary">
                      {f.label}
                    </th>
                  ))}
                  <th className="py-2 px-3 font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lists[activeTab].map((item, idx) => (
                  <tr key={item.id} className="hover:bg-secondary/20">
                    {FIELDS[activeTab].map((f) => (
                      <td key={f.name} className="py-2 px-3 text-primary">
                        {item[f.name]}
                      </td>
                    ))}
                    <td className="py-2 px-3 flex gap-2">
                      <button
                        className="text-blue-700 font-bold underline"
                        onClick={() => handleEdit(idx)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 font-bold underline"
                        onClick={() => handleDelete(idx)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!lists[activeTab].length && (
                  <tr>
                    <td colSpan={FIELDS[activeTab].length + 1} className="text-gray-400 text-center py-6">
                      No recent sales yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics */}
      {activeTab === "analytics" && (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white shadow flex flex-col items-center">
            <span className="text-2xl mb-2">⏳</span>
            <div className="text-xl font-bold">{stats.expiring ?? 0}</div>
            <div className="text-sm mt-1">Expiring Domains</div>
          </div>
          <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white shadow flex flex-col items-center">
            <span className="text-2xl mb-2">💡</span>
            <div className="text-xl font-bold">{stats.handreg ?? 0}</div>
            <div className="text-sm mt-1">Handreg Ideas</div>
          </div>
        </div>
      )}

      {/* Bulk Add Modal (Expiring/Handreg only) */}
      {bulkModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-xl w-full">
            <h2 className="text-xl font-bold mb-2 text-primary">Bulk Add ({TABS.find(t => t.key === activeTab)?.label})</h2>
            <p className="text-gray-500 text-sm mb-3">Paste CSV text or upload a CSV file. Only columns present in your table will be saved.</p>
            {/* CSV File Upload */}
            <input
              type="file"
              accept=".csv"
              className="mb-2"
              onChange={async (e) => {
                const file = e.target.files[0];
                setCsvFile(file);
                setBulkMsg("");
                setBulkPreview([]);
                if (!file) return;
                const text = await file.text();
                setBulkText(text);
                // Parse for preview
                const rows = parseCsv(text);
                const mapped = mapBulkData(rows);
                setBulkPreview(mapped.slice(0, 10)); // Preview first 10
                setBulkMsg(`${mapped.length} rows parsed.`);
              }}
            />
            <textarea
              rows={8}
              value={bulkText}
              onChange={e => {
                setCsvFile(null);
                setBulkText(e.target.value);
                setBulkMsg("");
                setBulkPreview([]);
                if (e.target.value) {
                  const rows = parseCsv(e.target.value);
                  const mapped = mapBulkData(rows);
                  setBulkPreview(mapped.slice(0, 10));
                  setBulkMsg(`${mapped.length} rows parsed.`);
                }
              }}
              className="w-full border border-accent rounded-lg p-2 mb-3 text-primary"
              placeholder={`Paste CSV rows here or upload a file.`}
            />
            {/* Preview */}
            {bulkPreview.length > 0 && (
              <div className="mb-2 max-h-40 overflow-y-auto text-xs bg-accent/20 rounded p-2">
                <b>Preview ({bulkPreview.length} rows, showing first 10):</b>
                <pre>{JSON.stringify(bulkPreview, null, 2)}</pre>
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-bold"
                onClick={async () => {
                  setBulkLoading(true);
                  setBulkMsg("");
                  const rows = parseCsv(bulkText);
                  const mapped = mapBulkData(rows);
                  if (!mapped.length) {
                    setBulkMsg("No valid rows found.");
                    setBulkLoading(false);
                    return;
                  }
                  const table =
                    activeTab === "expiring"
                      ? "dd_expiring_domains"
                      : "dd_handreg_domains";
                  const { error } = await supabase.from(table).insert(mapped);
                  if (error) setBulkMsg(error.message || "Insert failed.");
                  else setBulkMsg(`Successfully added ${mapped.length} rows!`);
                  setBulkLoading(false);
                  setBulkText("");
                  setCsvFile(null);
                  setBulkPreview([]);
                  // Refresh list
                  const all = await supabase.from(table).select("*").order("inserted_at", { ascending: false });
                  setLists((prev) => ({ ...prev, [activeTab]: all.data || [] }));
                  setSelectedIds([]);
                }}
                disabled={bulkLoading || !bulkText}
              >
                {bulkLoading ? "Adding..." : "Add All"}
              </button>
              <button
                className="px-4 py-2 border border-accent rounded-lg text-primary font-bold"
                onClick={() => {
                  setBulkModalOpen(false);
                  setBulkText("");
                  setBulkMsg("");
                  setCsvFile(null);
                  setBulkPreview([]);
                }}
              >
                Cancel
              </button>
            </div>
            {bulkMsg && <div className="mt-3 text-center text-secondary">{bulkMsg}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
