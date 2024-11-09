'use client';

import { useTelegramContext } from '@/providers/TelegramProvider';
import { Card } from './Card';

export function Balance() {
  const { theme, user } = useTelegramContext();

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span 
            className="text-sm opacity-75"
            style={{ color: theme.textColor }}
          >
            Balance
          </span>
          <img 
            src="https://api.iconify.design/cryptocurrency:bnb.svg"
            alt="BNB"
            className="w-6 h-6"
          />
        </div>
        <div className="flex items-end gap-2">
          <span 
            className="text-3xl font-bold"
            style={{ color: theme.textColor }}
          >
            0.00
          </span>
          <span 
            className="text-xl opacity-75"
            style={{ color: theme.textColor }}
          >
            BNB
          </span>
        </div>
        <span 
          className="text-sm opacity-50"
          style={{ color: theme.textColor }}
        >
          ≈ $0.00 USD
        </span>
      </div>
    </Card>
  );
}