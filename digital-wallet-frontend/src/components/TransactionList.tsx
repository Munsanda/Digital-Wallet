import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Eye, EyeOff } from 'lucide-react';
import { Transaction, User } from '../types';

interface TransactionListProps {
  currentUser: User;
  transactions: Transaction[];
}

export function TransactionList({ currentUser,  transactions }: TransactionListProps) {
  const [isBlurred, setIsBlurred] = useState(false);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md m-1">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-end">
        <button
          onClick={() => setIsBlurred(!isBlurred)}
          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isBlurred ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide
            </>
          )}
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg shadow-sm p-4">
      <ul role="list" className="divide-y divide-gray-200">
        {transactions.map((transaction) => {
          const isSender = transaction.senderId === currentUser.id;
          
          return (
            <li key={transaction.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${isSender ? 'text-red-500' : 'text-green-500'}`}>
                      {isSender ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <ArrowDownLeft className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className={`text-sm font-medium text-gray-900 ${isBlurred ? 'blur-sm' : ''}`}>
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="ml-6 flex items-center">
                    <p className={`text-sm font-medium ${
                      isSender ? 'text-red-500' : 'text-green-500'
                    } ${isBlurred ? 'blur-sm' : ''}`}>
                      {isSender ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
  );
}