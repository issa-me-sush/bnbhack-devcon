'use client';

import { useTonAddress, useTonWallet, useTonConnectUI  , useTonConnectModal} from '@tonconnect/ui-react';
import { useTelegramContext } from '@/providers/TelegramProvider';
import { Card } from './Card';
import { useEffect } from 'react';
export function TonWallet() {
  const { theme } = useTelegramContext();
  const wallet = useTonWallet();
  const userAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const { state, open, close } = useTonConnectModal();

  // const handleConnect = () => {
  //   // tonConnectUI.openModal();
  //   open()
  // };

  useEffect(() => {
    console.log('TON Wallet State:', {
      wallet,
      userAddress,
      modalState: state,
      tonConnectUI: !!tonConnectUI
    });
  }, [wallet, userAddress, state, tonConnectUI]);

  const handleConnect = async () => {
    try {
      console.log('Attempting to connect wallet...');
      open();
      
      // Optional: Add listener for connection status
      tonConnectUI.onStatusChange((wallet) => {
        console.log('Wallet status changed:', wallet);
      });

    } catch (error) {
      console.error('Error connecting wallet:', error);
      // Optionally show user-friendly error
      alert('Failed to connect wallet. Please try again.');
    }
  };

  // Add error boundary
  if (!tonConnectUI) {
    console.error('TON Connect UI not initialized');
    return (
      <Card className="w-full">
        <div className="text-red-500">
          Failed to initialize TON Connect. Please refresh the page.
        </div>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card className="w-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span 
              className="text-lg font-medium"
              style={{ color: theme.textColor }}
            >
              Connect Wallet
            </span>
            <img 
              src="https://ton.org/download/ton_symbol.svg"
              alt="TON"
              className="w-6 h-6"
            />
          </div>
          <button
            onClick={handleConnect}
            className="w-full py-3 rounded-xl font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.buttonColor, color: theme.buttonTextColor }}
          >
            <img 
              src="https://telegram.org/img/t_logo.svg"
              alt="Telegram"
              className="w-5 h-5"
            />
            Connect with Telegram
          </button>
        </div>
      </Card>
    );
  }


   // Log wallet details when connected
   console.log('Connected wallet details:', {
    // @ts-ignore 
    name: wallet.name,
        // @ts-ignore 
    balance: wallet.account.balance,
    address: userAddress
  });

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span 
            className="text-sm opacity-75"
            style={{ color: theme.textColor }}
          >
            {/* @ts-ignore  */}
            {wallet?.name || 'Telegram Wallet'}
          </span>
          <div className="flex items-center gap-2">
                  {/* @ts-ignore  */}
            {wallet?.imageUrl && (
              <img 
                    /* @ts-ignore  */ 
                src={wallet.imageUrl}
                      /* @ts-ignore  */
                alt={wallet.name || 'Wallet'}
                className="w-4 h-4 rounded-full"
              />
            )}
            <img 
              src="https://ton.org/download/ton_symbol.svg"
              alt="TON"
              className="w-4 h-4"
            />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span 
            className="text-3xl font-bold"
            style={{ color: theme.textColor }}
          >
                  {/* @ts-ignore  */}
            {wallet.account.balance ? Number(wallet.account.balance) / 1e9 : '0.00'}
          </span>
          <span 
            className="text-xl opacity-75"
            style={{ color: theme.textColor }}
          >
            TON
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span 
            className="text-sm opacity-50 truncate max-w-[200px]"
            style={{ color: theme.textColor }}
          >
            {userAddress}
          </span>
          <button
            onClick={() => {
              if (userAddress) {
                navigator.clipboard.writeText(userAddress);
              }
            }}
            className="text-sm opacity-75 hover:opacity-100 transition-opacity"
            style={{ color: theme.buttonColor }}
          >
            Copy
          </button>
        </div>
      </div>
    </Card>
  );
}