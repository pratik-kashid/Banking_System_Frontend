import useAccounts from "../hooks/useAccounts";

export default function AccountsPage() {
  const { accounts, loading, refreshAccounts } = useAccounts();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow">
        <p className="text-slate-500">Loading accounts...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Your Accounts</h1>

        <button
          onClick={refreshAccounts}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition"
        >
          Refresh
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow">
          <p className="text-slate-500">No accounts found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-white rounded-2xl p-6 shadow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{acc.accountType}</p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">
                    ₹{Number(acc.balance || 0).toFixed(2)}
                  </h2>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap">
                  {acc.status}
                </span>
              </div>

              <div className="mt-6 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-800">Account Number:</span>{" "}
                  {acc.accountNumber}
                </p>

                <p>
                  <span className="font-medium text-slate-800">Currency:</span>{" "}
                  {acc.currency}
                </p>

                <p>
                  <span className="font-medium text-slate-800">Holder:</span>{" "}
                  {acc.customerName || "-"}
                </p>

                <p>
                  <span className="font-medium text-slate-800">Phone:</span>{" "}
                  {acc.phone || "-"}
                </p>

                <p>
                  <span className="font-medium text-slate-800">Nominee:</span>{" "}
                  {acc.nomineeName || "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}