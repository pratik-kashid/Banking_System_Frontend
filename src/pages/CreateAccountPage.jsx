import { useState } from "react";
import api from "../api/axios";

export default function CreateAccountPage() {
  const [form, setForm] = useState({
    accountType: "SAVINGS",
    currency: "INR",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdAccount, setCreatedAccount] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setCreatedAccount(null);

    try {
      const response = await api.post("/accounts/me", form);
      setCreatedAccount(response.data);
      setMessage("Account created successfully");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create account");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={styles.card}>
        <label>Account Type</label>
        <select
          name="accountType"
          value={form.accountType}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="SAVINGS">Savings</option>
          <option value="CURRENT">Current</option>
        </select>

        <label>Currency</label>
        <input
          name="currency"
          value={form.currency}
          onChange={handleChange}
          style={styles.input}
        />

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" style={styles.button}>
          Create Account
        </button>
      </form>

      {createdAccount && (
        <div style={styles.resultCard}>
          <h3>Created Account</h3>
          <p>Account Number: {createdAccount.accountNumber}</p>
          <p>Type: {createdAccount.accountType}</p>
          <p>Balance: {createdAccount.balance} {createdAccount.currency}</p>
          <p>Status: {createdAccount.status}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    maxWidth: "420px",
    background: "#fff",
    padding: "24px",
    borderRadius: "14px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  resultCard: {
    marginTop: "20px",
    maxWidth: "420px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d0d7e2",
  },
  button: {
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
  },
};