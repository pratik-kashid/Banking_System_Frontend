import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import { useState } from "react";

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/accounts", label: "Accounts" },
    { to: "/create-account", label: "Create Account" },
    { to: "/deposit", label: "Deposit" },
    { to: "/withdraw", label: "Withdraw" },
    { to: "/beneficiaries", label: "Beneficiaries" },
    { to: "/transfer", label: "Transfer" },
    { to: "/transactions", label: "Transactions" },
  ];

  const pageMeta = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Overview of your banking activity",
    },
    "/accounts": {
      title: "Accounts",
      subtitle: "View and manage your bank accounts",
    },
    "/create-account": {
      title: "Create Account",
      subtitle: "Open a new bank account",
    },
    "/deposit": {
      title: "Deposit",
      subtitle: "Add money to your account",
    },
    "/withdraw": {
      title: "Withdraw",
      subtitle: "Withdraw money from your account",
    },
    "/beneficiaries": {
      title: "Beneficiaries",
      subtitle: "Manage saved transfer recipients",
    },
    "/transfer": {
      title: "Transfer",
      subtitle: "Send money securely",
    },
    "/transactions": {
      title: "Transactions",
      subtitle: "View your transaction history",
    },
    "/contact": {
      title: "Contact",
      subtitle: "Get in touch with support",
    },
  };

  const currentPage = pageMeta[location.pathname] || {
    title: "MyBank",
    subtitle: "Secure banking dashboard",
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-72 bg-slate-900 text-white p-6 flex flex-col shadow-2xl z-40 transform transition-transform duration-300 overflow-y-auto ${menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div>
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="logo" className="w-8 h-8" />
            <h1 className="text-3xl font-bold">iPay</h1>
          </div>
          <p className="text-slate-400 text-sm mt-2">Secure banking dashboard</p>
        </div>

        <div className="mt-8 bg-white/10 rounded-2xl p-4">
          <p className="text-sm text-slate-300">Signed in as</p>
          <p className="font-semibold mt-1 break-words">{user?.fullName || "User"}</p>
          <p className="text-sm text-slate-400 break-words">{user?.email || ""}</p>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl transition ${active
                    ? "bg-white text-slate-900 font-semibold"
                    : "text-slate-200 hover:bg-white/10"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-medium transition"
        >
          Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden bg-slate-900 text-white px-3 py-2 rounded-xl"
            >
              ☰
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-900">
                {currentPage.title}
              </h1>
              <p className="text-xs md:text-sm text-slate-500">
                {currentPage.subtitle}
              </p>
            </div>
          </div>

          <Link
            to="/contact"
            className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition text-sm md:text-base"
          >
            Contact
          </Link>
        </header>

        <main className="p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}