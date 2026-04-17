import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { saveAuth } from "../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slowMessage, setSlowMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSlowMessage("");
    setLoading(true);

    const timer = setTimeout(() => {
      setSlowMessage("Server is waking up. Please wait a few seconds...");
    }, 4000);

    try {
      const response = await api.post("/auth/login", form);
      saveAuth(response.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Login failed"
      );
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  {
    slowMessage && (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl px-4 py-3 text-sm">
        {slowMessage}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="hidden md:flex bg-slate-900 text-white p-10 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="logo" className="w-8 h-8" />
              <h1 className="text-3xl font-bold">iPay</h1>
            </div>
            <p className="mt-4 text-slate-300 leading-7">
              Secure digital banking with account management, transfers,
              deposits, withdrawals, beneficiaries, and statements.
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <p>• Secure authentication</p>
            <p>• Fast account actions</p>
            <p>• Modern banking dashboard</p>
          </div>
        </div>

        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-2">
              Log in to access your banking dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white rounded-xl py-3 font-medium hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading && (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-sm text-slate-600 mt-6 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="font-medium text-slate-900">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}