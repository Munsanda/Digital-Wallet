import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletBalanceProps {
  balance: number;
}

export function WalletBalance({ balance }: WalletBalanceProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Wallet className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Available Balance
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  ${balance.toFixed(2)}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}