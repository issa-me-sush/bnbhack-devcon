'use client';

import { createContext, useContext } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
interface TelegramContextType {
  webApp: any;
  user: any;
  theme: {
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
  };
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  theme: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#3390ec',
    buttonTextColor: '#ffffff',
  },
  isReady: false,
});


export function TelegramProvider({ children }: { children: React.ReactNode }) {
    const telegram = useTelegram();
  
    return (
      <TonConnectUIProvider 
        manifestUrl="/tonconnect-manifest.json"
        actionsConfiguration={{
          twaReturnUrl: `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}`
        }}
      >
        <TelegramContext.Provider value={telegram}>
          {children}
        </TelegramContext.Provider>
      </TonConnectUIProvider>
    );
  }
export const useTelegramContext = () => useContext(TelegramContext);