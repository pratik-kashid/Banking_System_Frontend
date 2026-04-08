import useAccounts from "../hooks/useAccounts";
import { getUser } from "../utils/auth";

export default function DashboardPage() {
  const { accounts, loading } = useAccounts();
  const user = getUser();

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          Welcome, {user?.fullName}
        </h2>
        <p className="text-slate-500 mt-2 text-sm md:text-base">
          Here’s an overview of your banking activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        <StatCard title="Total Balance" value={`₹${totalBalance.toFixed(2)}`} />
        <StatCard title="Accounts" value={accounts.length} />
        <StatCard title="Profile Status" value="Active" />
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Accounts</h3>

        {accounts.length === 0 ? (
          <p className="text-slate-500">No accounts found. Create your first account.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="border border-slate-200 rounded-2xl p-4 md:p-5 bg-slate-50"
              >
                <p className="text-sm text-slate-500">{acc.accountType}</p>
                <p className="text-xl md:text-2xl font-bold text-slate-900 mt-2 break-all">
                  ₹{Number(acc.balance || 0).toFixed(2)}
                </p>
                <p className="text-sm text-slate-500 mt-2 break-all">
                  {acc.accountNumber}
                </p>
                <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                  {acc.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow">
      <p className="text-slate-500 text-sm">{title}</p>
      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-3 break-all">
        {value}
      </h3>
    </div>
  );
}