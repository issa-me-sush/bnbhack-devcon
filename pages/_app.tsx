import type { AppProps } from 'next/app';
import Script from 'next/script';
import { TelegramProvider } from '@/providers/TelegramProvider';
import '@/styles/globals.css';
import {PrivyProvider} from '@privy-io/react-auth';
import {bsc} from 'viem/chains'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
     <Script
  src="/api/telegram-script"
  strategy="beforeInteractive"
/>
<PrivyProvider
      appId="cm3b5kzu20171ed9vnqf218ad"
      config={{
       
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: '',
        },
        loginMethods: ['email','wallet'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        defaultChain: bsc,
        supportedChains: [bsc]
      }}
    >
      <TelegramProvider>
        <Component {...pageProps} />
      </TelegramProvider>
      </PrivyProvider>

    </>
  );
}