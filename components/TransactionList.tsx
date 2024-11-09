'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
}

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch transactions from your backend or blockchain
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-md p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <h2 className="text-xl font-semibold">Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions yet</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.hash}
              className="p-3 rounded-lg bg-opacity-10 backdrop-blur-lg border border-gray-200/20"
            >
              <p className="text-sm">From: {tx.from}</p>
              <p className="text-sm">To: {tx.to}</p>
              <p className="text-sm">Amount: {ethers.utils.formatEther(tx.value)} BNB</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}