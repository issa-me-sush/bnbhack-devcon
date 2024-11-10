'use client';

import { useEffect, useState } from 'react'; // Add useState
import { useTelegramContext } from '@/providers/TelegramProvider';
import { TonWallet } from '@/components/TonWallet';
import { Actions } from '@/components/Actions';
import { SendTransaction } from '@/components/SendTransaction';
import { TransactionHistory } from '@/components/TransactionHistory';
import { CreateExpenseModal } from '@/components/CreateExpenseModal'; // Add this

export default function Home() {
  const { webApp, isReady, user, theme } = useTelegramContext();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false); // Add this

  useEffect(() => {
    if (isReady && webApp) {
      webApp.expand();
    }
  }, [isReady, webApp]);

  // Check if this is an expense payment link
  useEffect(() => {
    if (isReady && webApp) {
      const startParam = webApp.initDataUnsafe?.start_param;
      if (startParam?.startsWith('expense_')) {
        // Handle expense payment flow
        const expenseId = startParam.replace('expense_', '');
        // Redirect to expense payment page or show payment modal
        window.location.href = `/expense/${expenseId}`;
      }
    }
  }, [isReady, webApp]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
          style={{ borderColor: theme.buttonColor }}
        />
        <p style={{ color: theme.textColor }}>Loading...</p>
      </div>
    );
  }

  return (
    <main 
      className="flex min-h-screen flex-col items-start p-4 space-y-6"
      style={{ 
        backgroundColor: theme.backgroundColor,
        color: theme.textColor 
      }}
    >
      <header className="w-full">
        <h1 className="text-2xl font-bold mb-1">
          ChainChat
        </h1>
        {user && (
          <p className="text-sm opacity-75">
            Welcome back, {user.username || 'User'}
          </p>
        )}
      </header>

      <TonWallet />
      <Actions onCreateExpense={() => setIsExpenseModalOpen(true)} /> {/* Add prop */}
      <SendTransaction />
      <TransactionHistory />

      {/* Add Modal */}
      <CreateExpenseModal 
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />
    </main>
  );
}