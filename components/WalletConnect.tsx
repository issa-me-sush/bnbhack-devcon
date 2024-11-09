'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { useTelegramContext } from '@/providers/TelegramProvider';

export function WalletConnect() {
  const { webApp, theme } = useTelegramContext();
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        
        setAddress(address);
        setBalance(ethers.utils.formatEther(balance));
        
        webApp?.showAlert('Wallet connected successfully!');
      } else {
        webApp?.showAlert('Please install a Web3 wallet!');
      }
    } catch (error: any) {
      webApp?.showAlert('Failed to connect wallet: ' + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div 
      className="w-full max-w-md p-4 rounded-lg border"
      style={{
        backgroundColor: theme.backgroundColor,
        borderColor: theme.buttonColor + '20',
      }}
    >
      {!address ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full py-2 px-4 rounded-lg disabled:opacity-50"
          style={{
            backgroundColor: theme.buttonColor,
            color: theme.buttonTextColor,
          }}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="space-y-2">
          <p style={{ color: theme.textColor }}>
            Address: {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          <p style={{ color: theme.textColor }}>
            Balance: {Number(balance).toFixed(4)} BNB
          </p>
        </div>
      )}
    </div>
  );
}