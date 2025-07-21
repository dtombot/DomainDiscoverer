import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Turnstile from "react-turnstile";

export default function SignupPage() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMsg("Please verify you're not a robot.");
      return;
    }
    setMsg("Verifying...");

    // Verify Turnstile token with Netlify Function
    const resp = await fetch("/.netlify/functions/verify-turnstile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const result = await resp.json();
    if (!result.success) {
      setMsg("Captcha verification failed. Please try again.");
      return;
    }

    setMsg("Signing up...");
    const error = await signup(email, password);
    if (!error) {
      setMsg("Account created! Check your email to confirm. Redirecting...");
      setTimeout(() => navigate("/login"), 2500);
    } else {
      setMsg(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-28 bg-white p-6 rounded-xl shadow-lg border border-accent">
      <h2 className="text-2xl font-bold mb-4 text-center text-primary">Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary text-primary"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary text-primary"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Turnstile
          sitekey="0x4AAAAAABl9D3QD5xkT2Rr6" // <<< Your site key (public)
          onSuccess={setToken}
          className="rounded-lg"
          options={{ theme: "light" }}
        />
        <button
          className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-bold py-2 transition hover:scale-105"
          type="submit"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-3 text-center text-secondary font-medium">{msg}</p>
      <div className="mt-4 text-center">
        <a href="/login" className="text-primary font-bold hover:underline">
          Already have an account? Log in
        </a>
      </div>
    </div>
  );
}
