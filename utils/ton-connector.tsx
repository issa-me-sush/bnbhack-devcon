import { TonConnectUI } from '@tonconnect/ui';

class TonConnector {
  private static instance: TonConnector;
  private tonConnect: TonConnectUI | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.tonConnect = new TonConnectUI({
        manifestUrl: '/tonconnect-manifest.json',
        // Remove the buttonRootId option
      });
    }
  }

  public static getInstance(): TonConnector {
    if (!TonConnector.instance) {
      TonConnector.instance = new TonConnector();
    }
    return TonConnector.instance;
  }

  public getTonConnect(): TonConnectUI | null {
    return this.tonConnect;
  }
}

let tonConnector: TonConnector | null = null;

// Initialize only on client side
if (typeof window !== 'undefined') {
  tonConnector = TonConnector.getInstance();
}

export { tonConnector };