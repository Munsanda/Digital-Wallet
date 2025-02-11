import React, { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { WalletBalance } from './components/WalletBalance';
import { TransactionList } from './components/TransactionList';
import { SendMoneyForm } from './components/SendMoneyForm';
import { mockUsers, mockTransactions } from './data/mockData';
import { Transaction, User, AuthState } from './types';

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Simulate authentication with mock data
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setAuth({
        isAuthenticated: true,
        user
      });
    } else {
      alert('Invalid credentials');
    }
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Simulate registration with mock data
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      alert('Email already exists');
      return;
    }

    const newUser: User = {
      id: String(Date.now()),
      name,
      email,
      balance: 0,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
    };

    mockUsers.push(newUser);
    setAuth({
      isAuthenticated: true,
      user: newUser
    });
  };

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      user: null
    });
    setShowRegister(false);
  };

  const handleSendMoney = (receiverId: string, amount: number, description: string) => {
    if (!auth.user) return;

    // Validate sufficient balance
    if (amount > auth.user.balance) {
      alert('Insufficient balance');
      return;
    }

    // Create new transaction
    const newTransaction: Transaction = {
      id: String(Date.now()),
      senderId: auth.user.id,
      receiverId,
      amount,
      type: 'send',
      description,
      timestamp: new Date().toISOString()
    };

    // Update transactions
    setTransactions(prev => [newTransaction, ...prev]);

    // Update user balance (in a real app, this would be handled by the backend)
    setAuth(prev => {
      if (!prev.user) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          balance: prev.user.balance - amount
        }
      };
    });
  };

  if (!auth.isAuthenticated || !auth.user) {
    if (showRegister) {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  const userTransactions = transactions.filter(
    t => t.senderId === auth.user?.id || t.receiverId === auth.user?.id
  );

  return (
    <DashboardLayout user={auth.user} onLogout={handleLogout}>
      <div className="space-y-6">
        <WalletBalance balance={auth.user.balance} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Send Money</h2>
            <SendMoneyForm
              onSend={handleSendMoney}
              users={mockUsers}
              currentUser={auth.user}
            />
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
            <TransactionList
              transactions={userTransactions}
              currentUser={auth.user}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default App;