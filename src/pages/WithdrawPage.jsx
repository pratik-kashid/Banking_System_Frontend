import { useState, useEffect } from "react";
import api from "../api/axios";
import useAccounts from "../hooks/useAccounts";

export default function WithdrawPage() {
  const { accounts, refreshAccounts } = useAccounts();

  const [form, setForm] = useState({
    accountNumber: "",
    amount: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accounts.length > 0 && !form.accountNumber) {
      setForm((prev) => ({
        ...prev,
        accountNumber: accounts[0].accountNumber,
      }));
    }
  }, [accounts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/transactions/withdraw", {
        ...form,
        amount: Number(form.amount),
      });

      setMessage(`Withdrawal successful. Ref: ${response.data.referenceNumber}`);

      await refreshAccounts(); // 🔥

      setForm((prev) => ({
        ...prev,
        amount: "",
        description: "",
      }));

    } catch (err) {
      if (err?.response?.status === 409) {
        setError("Another transaction is in progress. Please retry.");
      } else {
        setError(err?.response?.data?.error || "Withdrawal failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
              {acc.accountNumber} - {acc.balance} {acc.currency}
            </option>
          ))}
        </select>

        <label>Amount</label>
        <input
          style={styles.input}
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
        />

        <label>Description</label>
        <input
          style={styles.input}
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button style={styles.button} disabled={loading}>
          {loading ? "Processing..." : "Withdraw"}
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