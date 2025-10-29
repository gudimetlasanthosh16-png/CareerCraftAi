
import React, { useState, useEffect } from 'react';
import { CareerPlan, OutreachContent } from '../types';
import { generateOutreachContent } from '../services/geminiService';
import { COPY_ICON } from '../constants';
import Spinner from './Spinner';

interface OutreachGeneratorProps {
  careerPlan: CareerPlan;
}

const OutreachCard: React.FC<{ title: string; content: string; }> = ({ title, content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-900/80 rounded-lg p-6 border border-slate-800 transition-all duration-300 hover:border-cyber-cyan/50">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-gray-300 font-semibold py-1 px-3 rounded-md text-sm transition-colors"
                >
                    {COPY_ICON}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <p className="text-gray-400 my-2 whitespace-pre-wrap">{content}</p>
        </div>
    );
}

const OutreachGenerator: React.FC<OutreachGeneratorProps> = ({ careerPlan }) => {
  const [outreachContent, setOutreachContent] = useState<OutreachContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateContent = async () => {
      try {
        setIsLoading(true);
        setError('');
        const content = await generateOutreachContent(careerPlan);
        setOutreachContent(content);
      } catch (err: any) {
        setError('Failed to generate outreach content. Please try refreshing.');
      } finally {
        setIsLoading(false);
      }
    };
    generateContent();
  }, [careerPlan]);

  return (
    <div className="bg-secondary/70 p-8 rounded-lg shadow-xl animate-slide-up border border-slate-800">
      <header className="border-b-2 border-cyber-cyan/30 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-white">Pitch & Outreach Generator</h1>
        <p className="text-gray-400 mt-1">Your AI networking assistant. Use these templates to make a great first impression.</p>
      </header>

      {isLoading && <Spinner message="Generating networking templates..." />}
      {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
      
      {!isLoading && outreachContent && (
        <div className="space-y-6">
            <OutreachCard title="Your Elevator Pitch" content={outreachContent.elevatorPitch} />
            <OutreachCard title="LinkedIn Connection Message" content={outreachContent.linkedinMessage} />
            <OutreachCard title="Informational Interview Request Email" content={outreachContent.informationalInterviewEmail} />
        </div>
      )}
    </div>
  );
};

export default OutreachGenerator;