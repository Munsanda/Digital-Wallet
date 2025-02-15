import React from 'react';
import { Wallet, History, LogOut } from 'lucide-react';
import { User } from '../types';
import { logout } from '../services/apiService';
import {  useNavigate } from 'react-router-dom';


interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DashboardLayout({ user, children, setIsAuthenticated}: DashboardLayoutProps) {
  const navigate = useNavigate();

  const logoutUser = async () => {
    
    console.log("Logging out..."); // Debugging
    await logout();
    setIsAuthenticated(false);
    console.log("Navigating to login...");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">D igiWallet</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.avatar}
                  alt={user.name}
                />
                <span className="ml-2 text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={logoutUser}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}