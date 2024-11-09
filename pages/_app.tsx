import type { AppProps } from 'next/app';
import Script from 'next/script';
import { TelegramProvider } from '@/providers/TelegramProvider';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
     <Script
  src="/api/telegram-script"
  strategy="beforeInteractive"
/>
      <TelegramProvider>
        <Component {...pageProps} />
      </TelegramProvider>
    </>
  );
}