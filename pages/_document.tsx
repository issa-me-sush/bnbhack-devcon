import { Html, Head, Main, NextScript } from "next/document";
import { TelegramProvider } from "@/providers/TelegramProvider";
import Script from "next/script";
export default function Document() {
  return (
    <Html lang="en">
      <Head >
      <Script 
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </Head>
      <body className="antialiased">
        <TelegramProvider>
        <Main />
        <NextScript />
        </TelegramProvider>
      </body>
    </Html>
  );
}
