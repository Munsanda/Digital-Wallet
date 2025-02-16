import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "./components/DashboardLayout";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { WalletBalance } from "./components/WalletBalance";
import { TransactionList } from "./components/TransactionList";
import { Transaction, User } from "./types";
import { fetchTransactions, fetchUser, logout } from "./services/apiService";
import { SendMoneyForm } from "./components/SendMoneyForm";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("authToken");  

  return token ? children : <Navigate to="/auth" />;
};


const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchData = async () => {
    try {
        const response = await fetchUser();
        setUser(response);
    } catch {
        setUser(null);  
          window.location.href = '/auth';
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const Transactions = async () => {
    try {
      const response = await fetchTransactions();
      setTransactions(response);
    } catch {
      setTransactions([]);
    }
  };

  useEffect(() => {
    Transactions();
  }, []);

  if (!user) return null;

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <WalletBalance balance={user.balance} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Send Money</h2>
            <SendMoneyForm reloadBalance={fetchData} reloadTransactions={Transactions} currentUser = {user} /> 
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 ">Recent Transactions</h2>
            <TransactionList transactions={transactions} currentUser={user} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const AuthPage = () => {
  const [showRegister, setShowRegister] = React.useState(false);
  
  return showRegister ? (
    <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
  ) : (
    <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
  );
};

export default function App() {
  
  return (
    <Router>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
    </Router>
  );
}


