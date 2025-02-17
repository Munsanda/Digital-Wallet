export interface User {
  walletId: string;
  name: string;
  phoneNumber: string;
  balance: number;
  avatar: string;
}

export interface Transaction {
  id: string;
  senderWalletId: string;
  receiverWalletId: string;
  amount: number;
  type: 'send' | 'receive';
  description: string;
  timestamp: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface loginCredentials {
  phoneNumber: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  phoneNumber: string;
  password: string;
}

export interface Recipient {
  id: string;
  fullName: string;
}


