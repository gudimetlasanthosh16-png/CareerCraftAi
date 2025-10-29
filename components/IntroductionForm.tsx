import React, { useState } from 'react';
import Spinner from './Spinner';

interface IntroductionFormProps {
  onSubmit: (text: string, isThinkingMode: boolean) => void;
  isLoading: boolean;
}

const IntroductionForm: React.FC<IntroductionFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [isThinkingMode, setIsThinkingMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text, isThinkingMode);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-8 animate-fade-in">
      <div className="bg-secondary/50 backdrop-blur-md rounded-lg shadow-2xl p-6 sm:p-10 border border-slate-800">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2" style={{textShadow: '0 0 10px rgba(8, 253, 216, 0.3)'}}>Craft Your Future</h2>
        <p className="text-gray-400 mb-6 text-base sm:text-lg">
          Tell us about your professional journey, skills, and aspirations. The more detail, the better your AI-powered career plan will be.
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-60 p-4 bg-primary/80 border border-slate-800 rounded-md focus:ring-2 focus:ring-cyber-cyan focus:border-cyber-cyan focus:outline-none transition duration-200 text-gray-200 placeholder-gray-500"
            placeholder="For example: I'm a full-stack developer with 5 years of experience in React and Node.js. I'm passionate about building scalable web applications and want to transition into a lead engineering role in the fintech industry..."
            disabled={isLoading}
          />
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex items-center">
                <label htmlFor="thinking-mode-toggle" className="flex items-center cursor-pointer group">
                    <div className="relative">
                    <input type="checkbox" id="thinking-mode-toggle" className="sr-only" checked={isThinkingMode} onChange={() => setIsThinkingMode(!isThinkingMode)} disabled={isLoading} />
                    <div className={`block w-14 h-8 rounded-full transition-colors ${isThinkingMode ? 'bg-accent' : 'bg-slate-800'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isThinkingMode ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-gray-300">
                    <span className="font-semibold transition-colors group-hover:text-cyber-cyan">Thinking Mode</span>
                    <p className="text-xs text-gray-500">For more complex queries. (Uses gemini-2.5-pro)</p>
                    </div>
                </label>
            </div>

            <button
                type="submit"
                className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center animate-pulse-glow"
                disabled={isLoading || !text.trim()}
            >
              {isLoading ? 'Generating...' : 'Generate Career Plan'}
            </button>
          </div>
        </form>
        {isLoading && <div className="mt-8"><Spinner message="AI is crafting your career plan... This may take a moment." /></div>}
      </div>
    </div>
  );
};

export default IntroductionForm;