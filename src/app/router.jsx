import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import AccountsPage from "../pages/AccountsPage";
import TransferPage from "../pages/TransferPage";
import TransactionHistoryPage from "../pages/TransactionHistoryPage";
import AppLayout from "../components/AppLayout";
import { getToken } from "../utils/auth";
import CreateAccountPage from "../pages/CreateAccountPage";
import DepositPage from "../pages/DepositPage";
import WithdrawPage from "../pages/WithdrawPage";
import BeneficiariesPage from "../pages/BeneficiariesPage";
import ContactPage from "../pages/ContactPage";
import CompleteProfilePage from "../pages/CompleteProfilePage";

function PrivateLayout() {
  return getToken() ? <AppLayout /> : <Navigate to="/" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/beneficiaries" element={<BeneficiariesPage />} />
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/transactions" element={<TransactionHistoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}