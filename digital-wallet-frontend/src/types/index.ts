export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  avatar: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  type: 'send' | 'receive';
  description: string;
  timestamp: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}