import React, { useState, useEffect, useRef } from "react";
import { Recipient, User } from "../types";
import { fetchUsers, sendMoney } from "../services/apiService";
import { Send } from "lucide-react";

interface SendMoneyFormProps {
  currentUser: User;
  reloadTransactions: () => void;
  reloadBalance: () => void;
}

export function SendMoneyForm({ currentUser, reloadBalance, reloadTransactions }: SendMoneyFormProps) {
  const [receiverId, setReceiverId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isAmountValid = () => {
    if (amount === "") return true;
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= currentUser.balance;
  };

  const isFormValid = () => {
    return receiverId && isAmountValid() && (description === "" || description.trim().length >= 3);
  };

  // Fetch recipients when the user types
  useEffect(() => {
    if (searchQuery.length > 1) {
      const fetchRecipients = async () => {
        try {
          const response = await fetchUsers(searchQuery);
          setRecipients(response);
          setShowDropdown(response.length > 0);
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
  }, [searchQuery]);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      console.warn("Invalid form submission");
      return;
    }

    try {
      await sendMoney(receiverId, parseFloat(amount), description);
      reloadBalance();
      reloadTransactions();
      setAmount("");
      setDescription("");
      setSearchQuery("");
      setReceiverId("");
    } catch (error) {
      console.error("Error sending money:", error);
    }
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
            className={`mt-1 block w-full px-3 py-2 border ${
              isAmountValid() ? "border-gray-300" : "border-red-500"
            } rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            max={currentUser.balance}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          {!isAmountValid() && <p className="text-red-500 text-xs">Invalid amount</p>}
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            className={`mt-1 block w-full px-3 py-2 border ${
              description.trim().length >= 3 || description === "" ? "border-gray-300" : "border-red-500"
            } rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {description.trim().length < 3 && description !== "" && <p className="text-red-500 text-xs">Description too short</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          disabled={!isFormValid()}
        >
          <Send className="h-4 w-4 mr-2" />
          Send Money
        </button>
      </form>
    </div>
  );
}
