

'use client';

import { useState } from 'react';
import { useTelegramContext } from '@/providers/TelegramProvider';
import { usePrivy } from '@privy-io/react-auth';

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateExpenseModal({ isOpen, onClose }: CreateExpenseModalProps) {
  const { theme, webApp, user } = useTelegramContext();
  const { authenticated,  login , user: privyUser} = usePrivy();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const showError = (message: string) => {
    // Check if we're in Telegram environment
    if (webApp && typeof webApp.showPopup === 'function') {
      webApp.showPopup({
        title: 'Error',
        message,
        buttons: [{ type: 'close' }]
      });
    } else {
      setError(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    if (!authenticated ) {
      try {
        await login();
        return;
      } catch (error) {
        showError('Please connect your wallet to create an expense');
        return;
      }
    }

    setLoading(true);

    try {
        const participantUsernames = participants
        .split(',')
        .map(p => p.trim())
        .filter(p => p.startsWith('@'));


        if (participantUsernames.length === 0) {
            throw new Error('Please add at least one participant');
          }
    
          // Create expense with creator's Telegram ID
          const response = await fetch('/api/expenses/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              totalAmount: parseFloat(amount),
              description,
              participants: participantUsernames, // Backend will handle ID resolution
              createdById: webApp.initDataUnsafe.user.id,
              createdByUsername: webApp.initDataUnsafe.user.username || 'Unknown',
              creatorWallet: privyUser?.wallet?.address
            })
          });
    
          const data = await response.json();

      if (data.success) {
        onClose();
        // Clear form
        setAmount('');
        setDescription('');
        setParticipants('');
        
        // Use showPopup instead of showAlert
        if (webApp && typeof webApp.showPopup === 'function') {
          webApp.showPopup({
            title: 'Expense Created!',
            message: `Total: ${amount} BNB\nPer person: ${(parseFloat(amount) / participantUsernames.length).toFixed(4)} BNB\n\nShare this link with participants:`,
            buttons: [
              {
                type: 'default',
                text: 'Copy Link',
                onClick: () => {
                  navigator.clipboard.writeText(
                    `https://t.me/splitbnb_bot/splitbnb?startapp=expense_${data.expense._id}`
                  );
                  // Use showPopup for confirmation too
                  webApp.showPopup({
                    message: 'Link copied to clipboard!',
                    buttons: [{ type: 'close' }]
                  });
                }
              },
              { type: 'close' }
            ]
          });
        }
      } else {
        throw new Error(data.error || 'Failed to create expense');
      }
    } catch (error) {
      console.error('Error:', error);
      showError(error instanceof Error ? error.message : 'Failed to create expense');
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

            {error && (
              <div 
                className="p-3 rounded-xl mb-4 text-center"
                style={{ 
                //   backgroundColor: theme.secondaryBgColor,
                  color: theme.textColor 
                }}
              >
                {error}
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