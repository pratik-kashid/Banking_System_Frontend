import { useEffect, useState } from "react";
import api from "../api/axios";

export default function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/accounts/all");
      setAccounts(res.data);
    } catch (err) {
      console.error("Failed to load accounts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return { accounts, loading, refreshAccounts: fetchAccounts };
}