'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTelegramContext } from '@/providers/TelegramProvider';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';

export default function ExpensePayment() {
  const router = useRouter();
  const { id } = router.query;
  const { webApp, theme, isReady } = useTelegramContext();
  const { login, authenticated, sendTransaction } = usePrivy();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verify Telegram context first
    if (!isReady) return;
    
    if (!webApp.initDataUnsafe?.user?.username) {
      setError('Please open this link in Telegram');
      setLoading(false);
      return;
    }

    if (id) {
      fetchExpense(id as string);
    }
  }, [id, isReady, webApp]);

  const fetchExpense = async (expenseId: string) => {
    try {
      if (!webApp?.initDataUnsafe?.user?.id) {
        setError('Please open this link in Telegram');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/expenses/${expenseId}`);
      const data = await response.json();
      
      if (data.success) {
        const currentUserId = webApp.initDataUnsafe.user.id;
        const currentUsername = webApp.initDataUnsafe.user.username;
        
        // Update participant's Telegram ID if not already set
        // @ts-ignore 
        if (!data.expense.participants.some(p => p.telegramId === currentUserId)) {
          await fetch(`/api/expenses/updateParticipant`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              expenseId,
              username: `@${currentUsername}`,
              telegramId: currentUserId
            })
          });
        }

        setExpense(data.expense);

    }
} catch (error) {
  console.error('Error:', error);
  setError('Failed to load expense');
} finally {
  setLoading(false);
}
};

  const handlePayment = async () => {
    if (!authenticated) {
      await login();
      return;
    }

    try {
      setLoading(true);
      const currentUsername = webApp.initDataUnsafe.user.username;
            // @ts-ignore 
      const participant = expense.participants.find(
              // @ts-ignore 
        p => p.telegramUsername === `@${currentUsername}`

      );

      if (!participant) {
        throw new Error('You are not a participant in this expense');
      }

      if (participant.paid) {
        throw new Error('You have already paid your share');
      }

      // Verify not paying to self      
       // @ts-ignore 
      if (`@${currentUsername}` === expense.createdBy) {
        throw new Error('You cannot pay yourself as the expense creator');
      }

      // Send payment to creator's wallet
      const tx = await sendTransaction({
              // @ts-ignore 
        to: expense.creatorWallet,
              // @ts-ignore 
        value: ethers.utils.parseEther(participant.amount.toString())
      });

      // Update payment status
      const updateResponse = await fetch('/api/expenses/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
                  // @ts-ignore 
          expenseId: expense._id,
          telegramUsername: `@${currentUsername}`,
                // @ts-ignore 
          txHash: tx.hash,
          walletAddress: tx.from
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update payment status');
      }
            // @ts-ignore 

      await fetchExpense(expense._id);
      webApp.showPopup({
        title: 'Payment Successful!',
        // @ts-ignore 
        message: `You've paid ${participant.amount} BNB to ${expense.createdBy}`,
        buttons: [{ type: 'close' }]
      });

    } catch (error) {
      console.error('Payment failed:', error);
            // @ts-ignore 
      webApp.showAlert(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: theme.buttonColor }}
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className="p-4 text-center min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <div 
          className="p-4 rounded-xl max-w-md w-full"
        //   style={{ backgroundColor: theme.secondaryBgColor }}
        >
          <h1 
            className="text-xl font-bold mb-2"
            style={{ color: theme.textColor }}
          >
            Access Denied
          </h1>
          <p style={{ color: theme.textColor }}>{error}</p>
        </div>
      </div>
    );
  }

  // No expense found
  if (!expense) {
    return (
      <div className="p-4 text-center" style={{ color: theme.textColor }}>
        <h1>Expense not found</h1>
      </div>
    );
  }

  const currentUsername = webApp.initDataUnsafe.user.username;
//   @ts-ignore 
  const currentParticipant = expense.participants.find(
    // @ts-ignore 
    p => p.telegramUsername === `@${currentUsername}`
  );
       {/* @ts-ignore  */}
  const isCreator = expense.createdBy === `@${currentUsername}`;

  return (
    <div 
      className="p-4 min-h-screen"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <h1 
        className="text-xl font-bold mb-4"
        style={{ color: theme.textColor }}
      >     {/* @ts-ignore  */}
        {expense.description}
      </h1>

      <div className="mb-6">
        <p 
          className="text-sm opacity-75 mb-2"
          style={{ color: theme.textColor }}
        >     {/* @ts-ignore  */}
          Created by: {expense.createdBy}
        </p>
        <p 
          className="font-medium"
          style={{ color: theme.textColor }}
        >     {/* @ts-ignore  */}
          Total Amount: {expense.totalAmount} BNB
        </p>
      </div>

      {isCreator ? (
        <div 
          className="p-4 rounded-xl mb-6"
        //   style={{ backgroundColor: theme.secondaryBgColor }}
        >
          <p style={{ color: theme.textColor }}>
            You created this expense. Waiting for others to pay.
          </p>
        </div>
      ) : currentParticipant ? (
        <div className="mb-6">
          <p 
            className="text-lg font-medium mb-4"
            style={{ color: theme.textColor }}
          >
            Your share: {currentParticipant.amount} BNB
          </p>

          {currentParticipant.paid ? (
            <div 
              className="p-3 rounded-xl text-center"
            //   style={{ backgroundColor: theme.secondaryBgColor }}
            >
              ✅ Paid
              {currentParticipant.txHash && (
                <p className="text-xs mt-2 opacity-75">
                  TX: {currentParticipant.txHash.slice(0, 6)}...
                  {currentParticipant.txHash.slice(-4)}
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium"
              style={{ 
                backgroundColor: theme.buttonColor,
                color: theme.buttonTextColor,
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Processing...' : authenticated ? 'Pay Now' : 'Connect to Pay'}
            </button>
          )}
        </div>
      ) : null}

      <div>
        <h2 
          className="font-medium mb-2"
          style={{ color: theme.textColor }}
        >
          Payment Status:
        </h2>
        <div className="space-y-2">
            {/* @ts-ignore  */}
          {expense.participants.map((p) => (
            <div 
              key={p.telegramUsername}
              className="flex justify-between p-3 rounded-xl"
            //   style={{ backgroundColor: theme.secondaryBgColor }}
            >
              <span style={{ color: theme.textColor }}>
                {p.telegramUsername}
                {p.telegramUsername === `@${currentUsername}` && ' (You)'}
              </span>
              <span 
                style={{ 
                  color: p.paid ? '#4CAF50' : theme.textColor 
                }}
              >
                {p.paid ? '✓ Paid' : `${p.amount} BNB`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}