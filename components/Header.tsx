import React from 'react';

interface HeaderProps {
  showResetButton: boolean;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ showResetButton, onReset }) => {
  return (
    <header className="bg-secondary/50 backdrop-blur-md p-4 shadow-lg sticky top-0 z-20 border-b border-slate-800">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <svg className="w-10 h-10 text-cyber-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <h1 className="text-2xl font-bold text-white" style={{textShadow: '0 0 8px rgba(8, 253, 216, 0.5)'}}>CareerCraft AI</h1>
        </div>
        {showResetButton && (
          <button 
            onClick={onReset}
            className="bg-slate-800 hover:bg-slate-900 border border-slate-800 hover:border-cyber-cyan text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-300"
          >
            Start Over
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;