import axios from 'axios';

import { loginCredentials, RegisterCredentials, User, Transaction } from '../types';



  const api = axios.create({
    baseURL: "http://localhost:5029/api", // Replace with your .NET API URL
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('authToken');
    console.log("Token in the apiservice",token);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  export const login = async (loginCredentials: loginCredentials) => {
    try {
      const response = await api.post("authenticate/login", loginCredentials);
      if (response.data) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        //navigate("/dashboard");
      }
      return response;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  export const fetchUsers = async (query: string) => {
    const response = await api.get(`Wallet/recipients?query=${query}`);
    console.log(response.data);
    return response.data;
  }


  export const register = (RegisterCredentials: RegisterCredentials) => 
    api.post(`authenticate/register`, RegisterCredentials);

  export const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = '/auth';
  };



  export const fetchUser = async (): Promise<User> => {
    const response = await api.get(`Wallet/user`);
    return response.data;
  };

  export const fetchBalance = async () => {
    const response = await api.get('/wallet/balance');
    return response.data;
  }
  

  export const fetchTransactions = async (): Promise<Transaction[]> => {
    const response = await api.get(`/wallet/transactions`);
    return response.data;
  };
  
  export const sendMoney = async (receiverWalletId: string, amount: number, description: string) => {
    const response = await api.post("/wallet/transfer", {
      receiverWalletId,
      amount,
      description,
      timestamp: new Date().toISOString()
    });
    return response.data;
  };

