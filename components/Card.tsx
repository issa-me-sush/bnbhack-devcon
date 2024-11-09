'use client';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-4 ${className}`}>
      {children}
    </div>
  );
}