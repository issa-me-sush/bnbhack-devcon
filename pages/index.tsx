'use client';

import { useEffect } from 'react';
import { useTelegramContext } from '@/providers/TelegramProvider';
import { WalletConnect } from '@/components/WalletConnect';
import { MainButton } from '@/components/MainButton';

export default function Home() {
  const { webApp, isReady, user, theme } = useTelegramContext();

  useEffect(() => {
    console.log('Home component mounted');
    console.log('WebApp status:', { isReady, webApp });
  }, [isReady, webApp]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
          style={{ borderColor: '#3390ec' }}
        />
        <p>
          Initializing Telegram WebApp...
        </p>
      </div>
    );
  }

  return (
    <main 
      className="flex min-h-screen flex-col items-center p-4 space-y-6"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <header className="w-full max-w-md">
        <h1 
          className="text-2xl font-bold"
          style={{ color: theme.textColor }}
        >
          ChainChat
        </h1>
        {user && (
          <p 
            className="text-sm opacity-75"
            style={{ color: theme.textColor }}
          >
            Welcome, {user.username || 'User'}
          </p>
        )}
      </header>

      <WalletConnect />

      <MainButton 
        text="Send Transaction"
        onClick={() => {
          webApp?.showAlert('Transaction feature coming soon!');
        }}
        disabled={false}
      />
    </main>
  );
}