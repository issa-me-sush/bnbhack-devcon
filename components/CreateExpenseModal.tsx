'use client';

import { useState } from 'react';
import { useTelegramContext } from '@/providers/TelegramProvider';
import { usePrivy } from '@privy-io/react-auth';

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateExpenseModal({ isOpen, onClose }: CreateExpenseModalProps) {
  const { theme, webApp } = useTelegramContext();
  const { authenticated, user, login } = usePrivy();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authenticated ) {
      await login();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/expenses/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description,
          creatorId: webApp?.initDataUnsafe?.user?.id || 123456789, // Fallback for testing
          walletAddress: user?.wallet.address,
          participantIds: [webApp?.initDataUnsafe?.user?.id || 123456789] // Just creator for now
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAmount('');
        setDescription('');
        onClose();
        webApp?.showAlert('Expense created!');
      }
    } catch (error) {
      webApp?.showAlert('Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md rounded-xl p-4" style={{ backgroundColor: theme.backgroundColor }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in BNB"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Expense'}
          </button>
        </form>
      </div>
    </div>
  );
}