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
  const { authenticated, login, user: privyUser } = usePrivy();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [participants, setParticipants] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!webApp?.initDataUnsafe?.user?.id) {
      setMessage('Please open in Telegram');
      return;
    }

    if (!authenticated || !privyUser?.wallet?.address) {
      try {
        await login();
        return;
      } catch (error) {
        setMessage('Please connect wallet');
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch('/api/expenses/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description,
          creatorId: webApp.initDataUnsafe.user.id,
          creatorWallet: privyUser.wallet.address,
          participantIds: [webApp.initDataUnsafe.user.id] // Just creator for now
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Copy payment link
        await navigator.clipboard.writeText(data.paymentLink);
        setAmount('');
        setDescription('');
        onClose();
        setMessage('Expense created! Link copied.');
      }
    } catch (error) {
      setMessage('Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div 
            className="w-full max-w-md rounded-xl p-4"
            style={{ backgroundColor: theme.backgroundColor }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 
                className="text-lg font-bold"
                style={{ color: theme.textColor }}
              >
                Create Group Expense
              </h2>
              <button 
                onClick={onClose}
                className="p-2"
                style={{ color: theme.textColor }}
              >
                ✕
              </button>
            </div>

            {message && (
              <div 
                className="p-3 rounded-xl mb-4 text-center"
                style={{ 
                //   backgroundColor: theme.secondaryBgColor,
                  color: theme.textColor 
                }}
              >
                {message}
              </div>
            )}

<form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              className="block text-sm mb-1 opacity-75"
              style={{ color: theme.textColor }}
            >
              Total Amount (BNB)
            </label>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full p-3 rounded-xl border"
              style={{ 
                borderColor: theme.buttonColor,
                color: theme.textColor,
                backgroundColor: 'transparent'
              }}
              required
            />
          </div>

          <div>
            <label 
              className="block text-sm mb-1 opacity-75"
              style={{ color: theme.textColor }}
            >
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Dinner at Restaurant"
              className="w-full p-3 rounded-xl border"
              style={{ 
                borderColor: theme.buttonColor,
                color: theme.textColor,
                backgroundColor: 'transparent'
              }}
              required
            />
          </div>

          <div>
            <label 
              className="block text-sm mb-1 opacity-75"
              style={{ color: theme.textColor }}
            >
              Participants (comma separated)
            </label>
            <textarea
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="@username1, @username2, @username3"
              className="w-full p-3 rounded-xl border min-h-[100px]"
              style={{ 
                borderColor: theme.buttonColor,
                color: theme.textColor,
                backgroundColor: 'transparent'
              }}
              required
            />
          </div>

          {!authenticated && (
            <p 
              className="text-sm"
              style={{ color: theme.textColor }}
            >
              You'll need to connect your wallet to receive payments
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-medium border"
              style={{ 
                borderColor: theme.buttonColor,
                color: theme.textColor
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-medium"
              style={{ 
                backgroundColor: theme.buttonColor,
                color: theme.buttonTextColor,
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Creating...' : authenticated ? 'Create' : 'Connect & Create'}
            </button>
          </div>
        </form>
          </div>
        </div>
      )}
    </>
  );
}