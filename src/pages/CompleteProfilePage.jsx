import { useState } from "react";
import api from "../api/axios";

export default function CompleteProfilePage() {
  const [form, setForm] = useState({
    dateOfBirth: "",
    phone: "",
    address: "",
    governmentId: "",
    nomineeName: "",
    occupation: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/customers/me", form);
      setMessage("Profile completed successfully");
    } catch (err) {
      if (err?.response?.data?.fields) {
        const fieldErrors = Object.values(err.response.data.fields).join(", ");
        setError(fieldErrors || "Validation failed");
      } else {
        setError(err?.response?.data?.error || "Failed to complete profile");
      }
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Complete Profile</h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input
            className="border rounded-xl px-4 py-3"
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
          />
          <input
            className="border rounded-xl px-4 py-3"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            className="border rounded-xl px-4 py-3 md:col-span-2"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />
          <input
            className="border rounded-xl px-4 py-3"
            name="governmentId"
            placeholder="Government ID"
            value={form.governmentId}
            onChange={handleChange}
          />
          <input
            className="border rounded-xl px-4 py-3"
            name="nomineeName"
            placeholder="Nominee Name"
            value={form.nomineeName}
            onChange={handleChange}
          />
          <input
            className="border rounded-xl px-4 py-3 md:col-span-2"
            name="occupation"
            placeholder="Occupation"
            value={form.occupation}
            onChange={handleChange}
          />

          {message && <div className="md:col-span-2 text-green-600">{message}</div>}
          {error && <div className="md:col-span-2 text-red-600">{error}</div>}

          <button className="bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 md:col-span-2">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}