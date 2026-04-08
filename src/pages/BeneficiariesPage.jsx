import { useEffect, useState } from "react";
import api from "../api/axios";

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [form, setForm] = useState({
    accountNumber: "",
    name: "",
    nickname: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchBeneficiaries = async () => {
    try {
      const response = await api.get("/beneficiaries");
      setBeneficiaries(response.data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load beneficiaries");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBeneficiaries();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/beneficiaries", form);
      setMessage("Beneficiary added successfully");
      setForm({
        accountNumber: "",
        name: "",
        nickname: "",
      });
      fetchBeneficiaries();
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to add beneficiary");
    }
  };

  return (
    <div>
      <form style={styles.formCard} onSubmit={handleSubmit}>
        <label>Account Number</label>
        <input
          style={styles.input}
          name="accountNumber"
          placeholder="Enter account number"
          value={form.accountNumber}
          onChange={handleChange}
        />

        <label>Name</label>
        <input
          style={styles.input}
          name="name"
          placeholder="Enter beneficiary name"
          value={form.name}
          onChange={handleChange}
        />

        <label>Nickname</label>
        <input
          style={styles.input}
          name="nickname"
          placeholder="Enter nickname"
          value={form.nickname}
          onChange={handleChange}
        />

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button style={styles.button} type="submit">
          Add Beneficiary
        </button>
      </form>

      <div style={styles.list}>
        {beneficiaries.map((b) => (
          <div key={b.id} style={styles.card}>
            <h3>{b.nickname}</h3>
            <p>Name: {b.name}</p>
            <p>Account Number: {b.accountNumber}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  formCard: {
    maxWidth: "500px",
    background: "#fff",
    padding: "24px",
    borderRadius: "14px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "24px",
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
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#fff",
    padding: "18px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },
};