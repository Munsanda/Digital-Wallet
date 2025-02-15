import axios from 'axios';
import { Navigate  } from 'react-router-dom';
import { loginCredentials, RegisterCredentials } from '../types';


const token = localStorage.getItem('token');

const api = axios.create({
    baseURL: 'http://localhost:5029/api', // Replace with your .NET API URL
     headers: {
       'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
     },
    
});

// api.interceptors.response.use(
//     response => response, // Pass successful responses
//     error => {
//         if (error.response?.status === 401) {
//             console.error("Unauthorized: Redirecting to login...");
//             // Redirect to login or perform logout
//             window.location.href = '/auth'; // Redirect to the login page
//         } 
//         else if (error.response?.status === 403) {
//             console.error("Forbidden: Insufficient permissions.");
//             // Show a "not allowed" message to the user
//             window.location.href = '/auth'; // Redirect to the login page
//         }
//         else if (error.response?.status === 401 && error.response?.data?.message === "Token expired") {
//             console.error("Session expired. Redirecting to login...");
//             window.location.href = '/auth'; // Redirect to the login page
//         }
        
//         return Promise.reject(error); // Reject other errors
//     }
// );


export const login = (loginCredentials: loginCredentials) => api.post(`authenticate/login`, loginCredentials);

export const register = (RegisterCredentials: RegisterCredentials) => api.post(`authenticate/register`, RegisterCredentials);

//export const registerAdmin = (adminDetails) => api.post(`authenticate/register-admin`, adminDetails);

export const logout = async () => {
    //const token = localStorage.getItem('token');
    localStorage.removeItem("authToken");
    // return api.get('/authenticate/logout', {
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     }
    // }); 
    console.log("logged out")
};

// 🔹 Fetch User Data
export const fetchUser = async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  };
  
  // 🔹 Fetch Transactions
  export const fetchTransactions = async (userId: string): Promise<Transaction[]> => {
    const response = await api.get(`/transactions?userId=${userId}`);
    return response.data;
  };
  
  // 🔹 Send Money
  export const sendMoney = async (senderId: string, receiverId: string, amount: number, description: string) => {
    const response = await api.post("/transactions/send", {
      senderId,
      receiverId,
      amount,
      description,
    });
    return response.data;
  };

