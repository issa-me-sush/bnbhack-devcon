import type { AppProps } from 'next/app';
import Script from 'next/script';
import { TelegramProvider } from '@/providers/TelegramProvider';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
        crossOrigin="anonymous"
      />
      <TelegramProvider>
        <Component {...pageProps} />
      </TelegramProvider>
    </>
  );
}