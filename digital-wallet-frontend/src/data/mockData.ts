import { User, Transaction } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    balance: 5000.00,
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    balance: 3500.00,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    amount: 100.00,
    type: 'send',
    description: 'Lunch payment',
    timestamp: '2024-03-10T12:00:00Z'
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    amount: 50.00,
    type: 'receive',
    description: 'Split bill',
    timestamp: '2024-03-09T15:30:00Z'
  }
];