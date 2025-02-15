import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { WalletBalance } from "./components/WalletBalance";
import { TransactionList } from "./components/TransactionList";
import { SendMoneyForm } from "./components/SendMoneyForm";
import { fetchUser } from "../src/services/apiService";
import { AuthState, Transaction, User  } from "./types";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("authToken")
  );
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      if (isAuthenticated) {
        try {
          // Fetch user using the token from localStorage
          //const userData = await fetchUser();

          const user1: User = {
            id: "user id",
            name: "John Doe",
            phoneNumber: "1234567890",
            balance: 1000,
            avatar: "m" // Add a random user avatar
            }

          setUser(user1);
        } catch (error) {
          console.error("Error fetching user:", error);
          // If fetching user fails, log out the user
          setIsAuthenticated(false);
          localStorage.removeItem("authToken");
        }
      }
    };

    loadUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/dashboard"
            element={
              isAuthenticated && user ? (
                <DashboardLayout
                  user={user}
                  onLogout={() => {
                    setIsAuthenticated(false);
                    localStorage.removeItem("authToken");
                  }}
                  setIsAuthenticated={setIsAuthenticated}
                >
                  <WalletBalance balance={user.balance} />
                  <TransactionList transactions={transactions} currentUser={user} />
                  {/* <SendMoneyForm /> */}
                </DashboardLayout>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/auth"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : showRegister ? (
                <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
              ) : (
                <LoginForm
                  setIsAuthenticated={setIsAuthenticated}
                  onSwitchToRegister={() => setShowRegister(true)}
                />
              )
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
}