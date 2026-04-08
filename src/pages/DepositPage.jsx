import { useState } from "react";
import api from "../api/axios";
import useAccounts from "../hooks/useAccounts";

export default function DepositPage() {
  const { accounts, refreshAccounts } = useAccounts();

  const [form, setForm] = useState({
    accountNumber: "",
    amount: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Set default account when accounts load
  if (accounts.length > 0 && !form.accountNumber) {
    setForm((prev) => ({
      ...prev,
      accountNumber: accounts[0].accountNumber,
    }));
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/transactions/deposit", {
        ...form,
        amount: Number(form.amount),
      });

      setMessage(`Deposit successful. Ref: ${response.data.referenceNumber}`);

      // 🔥 Auto refresh accounts
      await refreshAccounts();

      // reset form
      setForm((prev) => ({
        ...prev,
        amount: "",
        description: "",
      }));

    } catch (err) {
      if (err?.response?.status === 409) {
        setError("Another transaction is in progress. Please retry.");
      } else {
        setError(err?.response?.data?.error || "Deposit failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {accounts.length === 0 && (
        <p style={{ color: "red" }}>
          No accounts found. Please create an account first.
        </p>
      )}

      <form style={styles.card} onSubmit={handleSubmit}>
        <label>Select Account</label>
        <select
          style={styles.input}
          name="accountNumber"
          value={form.accountNumber}
          onChange={handleChange}
        >
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.accountNumber}>
              {acc.accountNumber} - {acc.accountType} - {acc.balance} {acc.currency}
            </option>
          ))}
        </select>

        <label>Amount</label>
        <input
          style={styles.input}
          name="amount"
          type="number"
          placeholder="Enter amount"
          value={form.amount}
          onChange={handleChange}
        />

        <label>Description</label>
        <input
          style={styles.input}
          name="description"
          placeholder="Deposit description"
          value={form.description}
          onChange={handleChange}
        />

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          style={styles.button}
          type="submit"
          disabled={loading || accounts.length === 0}
        >
          {loading ? "Processing..." : "Deposit"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: "500px",
    background: "#fff",
    padding: "24px",
    borderRadius: "14px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
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