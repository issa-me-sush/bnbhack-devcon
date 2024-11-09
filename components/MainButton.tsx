'use client';

import { useEffect } from 'react';
import { useTelegramContext } from '@/providers/TelegramProvider';

interface MainButtonProps {
  text: string;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function MainButton({ text, onClick, isLoading, disabled }: MainButtonProps) {
  const { webApp, isReady } = useTelegramContext();

  useEffect(() => {
    if (!isReady || !webApp) return;

    webApp.MainButton.setText(text);
    
    if (disabled) {
      webApp.MainButton.disable();
    } else {
      webApp.MainButton.enable();
    }

    if (isLoading) {
      webApp.MainButton.showProgress();
    } else {
      webApp.MainButton.hideProgress();
    }

    webApp.MainButton.onClick(onClick);
    webApp.MainButton.show();

    return () => {
      webApp.MainButton.offClick(onClick);
      webApp.MainButton.hide();
    };
  }, [webApp, isReady, text, onClick, isLoading, disabled]);

  return null;
}