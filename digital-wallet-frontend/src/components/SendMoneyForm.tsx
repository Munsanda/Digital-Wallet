import React, { useState, useEffect, useRef } from "react";
import { Recipient, User } from "../types";
import { fetchUsers, sendMoney } from "../services/apiService";
import { Send } from 'lucide-react';
import { Search } from "lucide-react";

interface SendMoneyFormProps {
  currentUser: User;
  reloadTransactions: () => void;
  reloadBalance: () => void;
}

export function SendMoneyForm({ currentUser, reloadBalance, reloadTransactions }: SendMoneyFormProps) {
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch recipients when user types
  useEffect(() => {
    if (searchQuery.length > 1) {
      const fetchRecipients = async () => {
        
        try {
          const response = await fetchUsers(searchQuery);

          const filteredUsers = response//.filter((user: Recipient) => user.walletId !== currentUser.id);

          setRecipients(filteredUsers);
          console.log(recipients);
          
          setShowDropdown(filteredUsers.length > 0);
        } catch {
          setRecipients([]);
          setShowDropdown(false);
        }
        
      };
      fetchRecipients();
    } else {
      setRecipients([]);
      setShowDropdown(false);
    }
  }, [searchQuery, currentUser.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUser = (user: Recipient) => {
    setReceiverId(user.id);
    setSearchQuery(user.fullName);
    setShowDropdown(false);
  
    console.log("Selected User ID:", user.id);
    console.log("Selected User:", user);
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!receiverId || !amount || !description) {
      console.warn("Missing required fields");
      return;
    }
  
    console.log("Sending money...", {
      sender: currentUser.id,
      receiver: receiverId,
      amount: parseFloat(amount),
      description,
    });
  
    try {
      const response = await sendMoney(receiverId, parseFloat(amount), description);
      console.log("Response:", response);
    } catch (error) {
      console.error("Error sending money:", error);
    }

    reloadBalance();
    reloadTransactions();
  
    setAmount("");
    setDescription("");
    setSearchQuery("");
    setReceiverId("");
  };
  

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900">Send Money</h3>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        {/* Searchable Input */}
        <div className="relative" ref={dropdownRef}>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
            Recipient
          </label>
          <input
            type="text"
            id="recipient"
            ref={inputRef}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
          />
          {/* Dropdown List */}
          {showDropdown && recipients.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-md max-h-40 overflow-auto">
              {recipients.map((user) => (
                <div
                  key={user.id}
                  className="px-3 py-2 cursor-pointer hover:bg-indigo-100"
                  onClick={() => handleSelectUser(user)}
                >
                  {user.fullName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (ZMW)
          </label>
          <input
            type="number"
            id="amount"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            max={currentUser.balance}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={!receiverId || !amount || !description}
        >
            <Send className="h-4 w-4 mr-2" />
          Send Money
        </button>

      </form>
    </div>
  );
}
