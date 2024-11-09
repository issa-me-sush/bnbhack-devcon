'use client';

import { useEffect } from 'react';
import { useTelegramContext } from '@/providers/TelegramProvider';
import { Balance } from '@/components/Balance';
import { Actions } from '@/components/Actions';
import { TransactionHistory } from '@/components/TransactionHistory';
export default function Home() {
  const { webApp, isReady, user, theme } = useTelegramContext();

  useEffect(() => {
    if (isReady && webApp) {
      webApp.expand();
    }
  }, [isReady, webApp]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
          style={{ borderColor: '#3390ec' }}
        />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main 
      className="flex min-h-screen flex-col items-start p-4 space-y-6"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <header className="w-full">
        <h1 
          className="text-2xl font-bold mb-1"
          style={{ color: theme.textColor }}
        >
          ChainChat Wallet
        </h1>
        {user && (
          <p 
            className="text-sm opacity-75"
            style={{ color: theme.textColor }}
          >
            Welcome back, {user.username || 'User'}
          </p>
        )}
      </header>

      <Balance />
      <Actions />
      <TransactionHistory />
    </main>
  );
}