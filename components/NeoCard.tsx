import React from 'react';

interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const NeoCard: React.FC<NeoCardProps> = ({ 
  children, 
  className = '', 
  color = 'bg-neo-white',
  hoverEffect = false,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        ${color} 
        border-3 border-neo-black 
        rounded-neo 
        shadow-neo 
        p-4 
        relative
        ${hoverEffect ? 'hover:-translate-y-1 hover:shadow-neo-lg transition-all cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default NeoCard;
