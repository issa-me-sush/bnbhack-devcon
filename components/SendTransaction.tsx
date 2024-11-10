'use client';

import { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useTelegramContext } from '@/providers/TelegramProvider';
import { Card } from './Card';

export function SendTransaction() {
  const { theme } = useTelegramContext();
  const [tonConnectUI] = useTonConnectUI();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleSend = async () => {
    try {
      const transaction = {
        validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
        messages: [
          {
            address: recipient,
            amount: (Number(amount) * 1e9).toString(), // Convert to nanotons
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      console.log('Transaction sent:', result);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <Card className="w-full">
      <></>
      {/* <div className="space-y-4">
        <h2 
          className="text-lg font-bold"
          style={{ color: theme.textColor }}
        >
          Send TON
        </h2>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10"
          style={{ color: theme.textColor }}
        />
        <input
          type="number"
          placeholder="Amount in TON"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10"
          style={{ color: theme.textColor }}
        />
        <button
          onClick={handleSend}
          className="w-full py-3 rounded-xl font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: theme.buttonColor, color: theme.buttonTextColor }}
        >
          Send TON
        </button>
      </div> */}
    </Card>
  );
}