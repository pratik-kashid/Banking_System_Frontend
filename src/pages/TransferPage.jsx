import { useEffect, useState } from "react";
import api from "../api/axios";
import useAccounts from "../hooks/useAccounts";

export default function TransferPage() {
  const { accounts, refreshAccounts } = useAccounts();

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [form, setForm] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBeneficiaries = async () => {
    try {
      const response = await api.get("/beneficiaries");
      setBeneficiaries(response.data);
    } catch (err) {
      console.error("Failed to load beneficiaries", err);
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  useEffect(() => {
    if (accounts.length > 0 && !form.fromAccount) {
      setForm((prev) => ({
        ...prev,
        fromAccount: accounts[0].accountNumber,
      }));
    }
  }, [accounts]);

  useEffect(() => {
    if (beneficiaries.length > 0 && !form.toAccount) {
      setForm((prev) => ({
        ...prev,
        toAccount: beneficiaries[0].accountNumber,
      }));
    }
  }, [beneficiaries]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/transactions/transfer", {
        ...form,
        amount: Number(form.amount),
      });

      setMessage(`Transfer successful. Ref: ${response.data.referenceNumber}`);
      await refreshAccounts();

      setForm((prev) => ({
        ...prev,
        amount: "",
        description: "",
      }));
    } catch (err) {
      if (err?.response?.status === 409) {
        setError("Another transaction is in progress. Please retry.");
      } else {
        setError(err?.response?.data?.error || "Transfer failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {beneficiaries.length === 0 && (
        <p style={{ color: "red" }}>
          No beneficiaries found. Please add a beneficiary first.
        </p>
      )}

      <form style={styles.card} onSubmit={handleSubmit}>
        <label>From Account</label>
        <select
          style={styles.input}
          name="fromAccount"
          value={form.fromAccount}
          onChange={handleChange}
        >
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.accountNumber}>
              {acc.accountNumber} - {acc.balance} {acc.currency}
            </option>
          ))}
        </select>

        <label>Beneficiary</label>
        <select
          style={styles.input}
          name="toAccount"
          value={form.toAccount}
          onChange={handleChange}
          disabled={beneficiaries.length === 0}
        >
          {beneficiaries.map((b) => (
            <option key={b.id} value={b.accountNumber}>
              {b.nickname} - {b.accountNumber}
            </option>
          ))}
        </select>

        <label>Amount</label>
        <input
          style={styles.input}
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />

        <label>Description</label>
        <input
          style={styles.input}
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          style={styles.button}
          type="submit"
          disabled={loading || beneficiaries.length === 0}
        >
          {loading ? "Processing..." : "Transfer"}
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