'use client';

import { useTelegramContext } from '@/providers/TelegramProvider';

interface ActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  const { theme } = useTelegramContext();
  
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105"
      style={{ backgroundColor: theme.buttonColor + '20' }}
    >
      <img src={icon} alt={label} className="w-8 h-8" />
      <span style={{ color: theme.textColor }}>{label}</span>
    </button>
  );
}

export function Actions() {
  const { webApp } = useTelegramContext();

  const actions = [
    {
      icon: 'https://api.iconify.design/solar:swap-bold.svg?color=white',
      label: 'Swap',
      onClick: () => webApp?.showAlert('Swap coming soon!')
    },
    {
      icon: 'https://api.iconify.design/solar:users-group-rounded-bold.svg?color=white',
      label: 'Split',
      onClick: () => webApp?.showAlert('Split coming soon!')
    },
    {
      icon: 'https://api.iconify.design/solar:card-transfer-bold.svg?color=white',
      label: 'Send',
      onClick: () => webApp?.showAlert('Send coming soon!')
    },
    {
      icon: 'https://api.iconify.design/solar:history-bold.svg?color=white',
      label: 'History',
      onClick: () => webApp?.showAlert('History coming soon!')
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 w-full">
      {actions.map((action) => (
        <ActionButton key={action.label} {...action} />
      ))}
    </div>
  );
}