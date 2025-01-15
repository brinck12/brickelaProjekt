import React from 'react';

interface NavLinkProps {
  children: React.ReactNode;
  onClick: () => void;
  tooltip: string;
}

export default function NavLink({ children, onClick, tooltip }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className="group relative p-2 hover:bg-slate-800 rounded-lg transition-colors text-indigo-400 hover:text-indigo-300"
      aria-label={tooltip}
    >
      {children}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {tooltip}
      </span>
    </button>
  );
}