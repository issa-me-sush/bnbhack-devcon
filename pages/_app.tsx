import type { AppProps } from 'next/app'
import { TelegramProvider } from '@/providers/TelegramProvider'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TelegramProvider>
      <Component {...pageProps} />
    </TelegramProvider>
  )
}