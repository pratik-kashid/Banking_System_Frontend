import { useEffect, useState } from "react";
import api from "../api/axios";

export default function TransactionHistoryPage() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({
    accountNumber: "",
    type: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts/all");
      setAccounts(res.data);
    } catch (err) {
      console.error("Failed to load accounts", err);
    }
  };

  const fetchTransactions = async () => {
    setError("");

    try {
      const res = await api.post("/transactions/search", {
        accountNumber: filter.accountNumber || null,
        type: filter.type || null,
        startDate: filter.startDate || null,
        endDate: filter.endDate || null,
      });
      setTransactions(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load transactions");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAccounts();
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Transaction History</h2>

        <div className="grid md:grid-cols-4 gap-4">
          <select
            name="accountNumber"
            value={filter.accountNumber}
            onChange={handleChange}
            className="border border-slate-300 rounded-xl px-4 py-3"
          >
            <option value="">All Accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.accountNumber}>
                {a.accountNumber} - {a.customerName}
              </option>
            ))}
          </select>

          <select
            name="type"
            value={filter.type}
            onChange={handleChange}
            className="border border-slate-300 rounded-xl px-4 py-3"
          >
            <option value="">All Types</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAW">Withdraw</option>
            <option value="TRANSFER">Transfer</option>
          </select>

          <input
            type="date"
            name="startDate"
            value={filter.startDate}
            onChange={handleChange}
            className="border border-slate-300 rounded-xl px-4 py-3"
          />

          <input
            type="date"
            name="endDate"
            value={filter.endDate}
            onChange={handleChange}
            className="border border-slate-300 rounded-xl px-4 py-3"
          />
        </div>

        <button
          onClick={fetchTransactions}
          className="mt-4 bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800"
        >
          Search
        </button>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {transactions.map((t) => (
          <div key={t.referenceNumber} className="bg-white rounded-2xl p-5 shadow">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{t.type}</h3>
                <p className="text-slate-500 text-sm mt-1">Ref: {t.referenceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">₹{t.amount}</p>
                <p className="text-sm text-slate-500">{t.status}</p>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-600 space-y-1">
              <p>From: {t.fromAccount || "-"}</p>
              <p>To: {t.toAccount || "-"}</p>
              <p>Description: {t.description || "-"}</p>
              <p>Date: {t.createdAt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}