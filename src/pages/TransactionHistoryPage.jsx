import { useEffect, useState } from "react";
import api from "../api/axios";
import useAccounts from "../hooks/useAccounts";

export default function TransactionHistoryPage() {
  const { accounts } = useAccounts();

  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({
    accountNumber: "",
    type: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    setError("");

    try {
      const response = await api.post("/transactions/search", {
        accountNumber: filter.accountNumber || null,
        type: filter.type || null,
        startDate: filter.startDate || null,
        endDate: filter.endDate || null,
      });

      setTransactions(response.data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load transactions");
    }
  };

  const downloadStatement = async () => {
    try {
      const response = await api.get("/transactions/statement", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "statement.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to download statement");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div style={styles.filters}>
        <select
          style={styles.input}
          name="accountNumber"
          value={filter.accountNumber}
          onChange={handleChange}
        >
          <option value="">All Accounts</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.accountNumber}>
              {a.accountNumber}
            </option>
          ))}
        </select>

        <select
          style={styles.input}
          name="type"
          value={filter.type}
          onChange={handleChange}
        >
          <option value="">All Types</option>
          <option value="DEPOSIT">Deposit</option>
          <option value="WITHDRAW">Withdraw</option>
          <option value="TRANSFER">Transfer</option>
        </select>

        <input
          style={styles.input}
          type="date"
          name="startDate"
          value={filter.startDate}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="date"
          name="endDate"
          value={filter.endDate}
          onChange={handleChange}
        />

        <button style={styles.button} onClick={fetchTransactions}>
          Search
        </button>

        <button style={styles.buttonSecondary} onClick={downloadStatement}>
          Download Statement
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={styles.list}>
        {transactions.map((t) => (
          <div key={t.referenceNumber} style={styles.card}>
            <h3>{t.type}</h3>
            <p>Amount: ₹{t.amount}</p>
            <p>Date: {t.createdAt}</p>
            <p>Reference: {t.referenceNumber}</p>
            <p>Status: {t.status}</p>
            <p>From: {t.fromAccount || "-"}</p>
            <p>To: {t.toAccount || "-"}</p>
            <p>Description: {t.description || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d0d7e2",
  },
  button: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
  },
  buttonSecondary: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
  list: {
    display: "grid",
    gap: "12px",
  },
  card: {
    background: "#fff",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },
};