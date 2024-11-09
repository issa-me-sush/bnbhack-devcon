import WebApp from "@twa-dev/sdk"

export const initTelegramApp = () => {
  if (typeof window !== 'undefined') {
    WebApp.ready();
    WebApp.expand();
    
    // Set theme
    document.body.style.backgroundColor = WebApp.backgroundColor;
    
    return WebApp;
  }
  return null;
};

export const validateInitData = (initData: string): boolean => {
  const searchParams = new URLSearchParams(initData);
  const hash = searchParams.get('hash');
  if (!hash) return false;

  // Remove hash from initData
  searchParams.delete('hash');
  
  // Create data check string
  const dataCheckString = Array.from(searchParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // TODO: Implement proper hash validation with your bot token
  return true;
};