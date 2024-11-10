'use client';

import { useTelegramContext } from '@/providers/TelegramProvider';
import { Card } from './Card';

const MOCK_TRANSACTIONS = [
  {
    type: 'split',
    title: 'Lunch Split',
    amount: '0.05 BNB',
    date: '2024-01-20',
    participants: ['Alice', 'Bob', 'Charlie']
  },
  {
    type: 'swap',
    title: 'BNB → USDT',
    amount: '0.1 BNB',
    date: '2024-01-19'
  },
  {
    type: 'send',
    title: 'Sent to @john',
    amount: '0.02 BNB',
    date: '2024-01-18'
  }
];

export function TransactionHistory() {
  const { theme } = useTelegramContext();

  return (
    <Card className="w-full">
      <h2 
        className="text-lg font-bold mb-4"
        style={{ color: theme.textColor }}
      >
        Recent Activity
      </h2>
      <div className="space-y-4">
        {MOCK_TRANSACTIONS.map((tx, index) => (
          <div 
            key={index}
            className="flex items-center justify-between py-2 border-b last:border-0"
            style={{ borderColor: theme.buttonColor + '20' }}
          >
            <div className="flex items-center gap-3">
              <img 
                src={`https://api.iconify.design/fluent:arrow-swap-16-filled.svg?color=black`}
                alt={tx.type}
                className="w-6 h-6 "
              />
              <div className="flex flex-col">
                <span style={{ color: theme.textColor }}>{tx.title}</span>
                <span 
                  className="text-sm opacity-50"
                  style={{ color: theme.textColor }}
                >
                  {tx.date}
                </span>
              </div>
            </div>
            <span 
              className="font-medium"
              style={{ color: theme.textColor }}
            >
              {tx.amount}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}