import { useState } from "react";
import api from "../api/axios";

export default function CreateAccountPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    governmentId: "",
    nomineeName: "",
    occupation: "",
    accountType: "SAVINGS",
    currency: "INR",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdAccount, setCreatedAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setCreatedAccount(null);
    setLoading(true);

    try {
      const response = await api.post("/accounts", form);
      setCreatedAccount(response.data);
      setMessage("Customer account created successfully");
      setForm({
        fullName: "",
        email: "",
        dateOfBirth: "",
        phone: "",
        address: "",
        governmentId: "",
        nomineeName: "",
        occupation: "",
        accountType: "SAVINGS",
        currency: "INR",
      });
    } catch (err) {
      if (err?.response?.data?.fields) {
        const fieldErrors = Object.values(err.response.data.fields).join(", ");
        setError(fieldErrors || "Validation failed");
      } else {
        setError(err?.response?.data?.error || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Customer Account</h2>
        <p className="text-slate-500 mb-6">
          Fill customer details as provided on the bank account opening form.
        </p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Customer full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Customer email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit phone number"
              maxLength={10}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
            <textarea
              className="w-full border border-slate-300 rounded-xl px-4 py-3 min-h-[100px]"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Customer full address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Government ID</label>
            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              name="governmentId"
              value={form.governmentId}
              onChange={handleChange}
              placeholder="PAN / Aadhaar / ID Number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nominee Name</label>
            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              name="nomineeName"
              value={form.nomineeName}
              onChange={handleChange}
              placeholder="Nominee full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Occupation</label>
            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
              placeholder="Occupation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Account Type</label>
            <select
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              name="accountType"
              value={form.accountType}
              onChange={handleChange}
            >
              <option value="SAVINGS">Savings</option>
              <option value="CURRENT">Current</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              name="currency"
              value={form.currency}
              onChange={handleChange}
              placeholder="INR"
            />
          </div>

          {message && (
            <div className="md:col-span-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 transition disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {createdAccount && (
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Created Account</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-700">
              <p><span className="font-medium">Holder:</span> {createdAccount.customerName}</p>
              <p><span className="font-medium">Email:</span> {createdAccount.customerEmail}</p>
              <p><span className="font-medium">Account Number:</span> {createdAccount.accountNumber}</p>
              <p><span className="font-medium">Account Type:</span> {createdAccount.accountType}</p>
              <p><span className="font-medium">Phone:</span> {createdAccount.phone}</p>
              <p><span className="font-medium">Nominee:</span> {createdAccount.nomineeName}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}