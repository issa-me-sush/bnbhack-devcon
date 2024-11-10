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
interface ActionsProps {
    onCreateExpense: () => void;
  }
  
export function Actions({ onCreateExpense }: ActionsProps) {
  const { webApp } = useTelegramContext();

  const actions = [
    {
      icon: 'https://api.iconify.design/iconamoon:swap-fill.svg?color=white`',
      label: 'Swap',
      onClick: () => webApp?.showAlert('Swap coming soon!')
    },
    // {
    //   icon: 'https://api.iconify.design/solar:users-group-rounded-bold.svg?color=black',
    //   label: 'Split',
    //   onClick: () => webApp?.showAlert('Split coming soon!')
    // },
    {
      icon: 'https://api.iconify.design/solar:card-transfer-bold.svg?color=black',
      label: 'Send',
      onClick: () => webApp?.showAlert('Send coming soon!')
    },
    {
      icon: 'https://api.iconify.design/solar:history-bold.svg?color=black',
      label: 'History',
      onClick: () => webApp?.showAlert('History coming soon!')
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 w-full">
      {actions.map((action) => (
        <ActionButton key={action.label} {...action} />
      ))}

     < button
        onClick={onCreateExpense}
        className="p-4 rounded-xl flex flex-col items-center justify-center gap-2"
        // style={{ backgroundColor: theme.secondaryBgColor }}
      >
        <span className="text-2xl">👥</span>
        <span 
          className="text-sm font-medium"
        //   style={{ color: theme.textColor }}
        >
          Group Expense
        </span>
      </button>
    </div>
  );
}