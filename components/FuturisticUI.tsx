import React, { ReactNode } from 'react';

export const NeonButton: React.FC<{ 
  onClick?: () => void; 
  children: ReactNode; 
  color?: 'blue' | 'purple' | 'green' | 'red';
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, color = 'blue', className = '', disabled = false }) => {
  const colors = {
    blue: 'border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 hover:shadow-neon-blue',
    purple: 'border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500/10 hover:shadow-neon-purple',
    green: 'border-green-500 text-green-500 hover:bg-green-500/10 hover:shadow-[0_0_10px_#0aff0a]',
    red: 'border-red-500 text-red-500 hover:bg-red-500/10 hover:shadow-[0_0_10px_#ff0a0a]'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 font-bold text-lg uppercase tracking-wider
        border-2 transition-all duration-300 transform active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${colors[color]}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
    </button>
  );
};

export const GlassCard: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass-panel p-6 rounded-xl shadow-lg text-gray-100 ${className}`}>
    {children}
  </div>
);

export const Header: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <header className="mb-8 text-center relative">
    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
      {title}
    </h1>
    {subtitle && <p className="text-cyan-200 mt-2 font-mono text-lg">{subtitle}</p>}
    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-cyan-500 rounded-full shadow-neon-blue" />
  </header>
);
