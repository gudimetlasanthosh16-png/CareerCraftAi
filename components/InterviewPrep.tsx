

import React, { useState, useEffect, useRef } from 'react';
import { CareerPlan, ChatMessage } from '../types';
import { getInterviewResponse } from '../services/geminiService';
import Spinner from './Spinner';

interface InterviewPrepProps {
  careerPlan: CareerPlan;
}

const InterviewPrep: React.FC<InterviewPrepProps> = ({ careerPlan }) => {
  const [sessionState, setSessionState] = useState<'idle' | 'active' | 'finished'>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startInterview = async () => {
    setSessionState('active');
    setIsLoading(true);
    setMessages([]);
    setQuestionCount(1);
    try {
      const response = await getInterviewResponse(
        [{ role: 'user', content: 'start' }],
        careerPlan
      );
      setMessages([{ role: 'model', content: response }]);
    } catch (e) {
      setMessages([{ role: 'model', content: 'Sorry, I had trouble starting the interview. Please try again.' }]);
      setSessionState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userAnswer },
    ];
    setMessages(newMessages);
    setUserAnswer('');
    setIsLoading(true);

    try {
      const response = await getInterviewResponse(newMessages, careerPlan);
      const [feedback, nextOrSummary] = response.split('|||');
      
      const responseMessages: ChatMessage[] = [];
      if (feedback) {
        responseMessages.push({ role: 'model', content: `**Feedback:**\n${feedback.trim()}` });
      }
      if (nextOrSummary) {
        if (questionCount < 5) {
          responseMessages.push({ role: 'model', content: nextOrSummary.trim() });
          setQuestionCount(prev => prev + 1);
        } else {
           responseMessages.push({ role: 'model', content: `**Final Summary:**\n${nextOrSummary.trim()}` });
           setSessionState('finished');
        }
      } else {
        // Handle cases where delimiter is missing in response
         if (questionCount >= 5) {
            setMessages(prev => [...prev, { role: 'model', content: `**Final Summary:**\n${feedback.trim()}` }]);
            setSessionState('finished');
         } else {
            setMessages(prev => [...prev, { role: 'model', content: 'Sorry, there was an issue with the response. Please try answering again or restart.' }]);
         }
      }
      setMessages(prev => [...prev, ...responseMessages]);

    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', content: 'An error occurred. Please try submitting your answer again.' }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderIdle = () => (
    <div className="text-center p-8">
      <h2 className="text-3xl font-bold text-white mb-4">Mock Interview Practice</h2>
      <p className="text-gray-400 max-w-2xl mx-auto mb-8">
        Hone your interview skills with an AI-powered mock interview tailored to your career goals. 
        You'll be asked 5 questions and receive instant feedback on your answers.
      </p>
      <button
        onClick={startInterview}
        disabled={isLoading}
        className="bg-accent hover:bg-accent-hover text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Initializing...' : 'Start Interview'}
      </button>
    </div>
  );

  const renderActiveOrFinished = () => (
    <div className="flex flex-col min-h-[70vh]">
        <header className="p-4 border-b border-slate-700">
            <h3 className="text-xl font-semibold text-white">Interview Session</h3>
            <p className="text-sm text-gray-400">Question {Math.min(questionCount, 5)} of 5</p>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                <div className="bg-cyber-cyan h-1.5 rounded-full transition-all duration-500" style={{ width: `${(questionCount / 5) * 100}%` }}></div>
            </div>
        </header>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xl px-4 py-3 rounded-2xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-accent text-white rounded-br-none' : 'bg-slate-800 text-gray-200 rounded-bl-none'}`}>
                        {/* FIX: Replaced `replaceAll` with `replace` for broader JS compatibility. The global flag in the regex ensures all instances are replaced. */}
                        <p className="text-sm" dangerouslySetInnerHTML={{__html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyber-cyan/90">$1</strong>')}}></p>
                    </div>
                </div>
            ))}
            {isLoading && <div className="flex justify-start"><div className="px-4 py-3"><Spinner message="Analyzing..." /></div></div>}
            <div ref={messagesEndRef} />
        </div>
        {sessionState === 'active' && (
            <div className="p-4 border-t border-slate-700 bg-secondary/50">
                <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), submitAnswer())}
                    placeholder="Type your answer here... (Press Enter to submit)"
                    className="w-full h-24 p-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyber-cyan focus:outline-none transition"
                    disabled={isLoading}
                />
                <button
                    onClick={submitAnswer}
                    disabled={isLoading || !userAnswer.trim()}
                    className="w-full mt-2 bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Submitting...' : 'Submit Answer'}
                </button>
            </div>
        )}
         {sessionState === 'finished' && (
            <div className="p-4 border-t border-slate-700 text-center bg-secondary/50">
                 <p className="text-lg text-cyber-cyan font-semibold mb-4">Interview Complete!</p>
                <button
                    onClick={() => { setSessionState('idle'); setQuestionCount(0); setMessages([]); }}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    Start New Interview
                </button>
            </div>
        )}
    </div>
  );

  return (
    <div className="bg-secondary/70 rounded-lg shadow-xl animate-slide-up border border-slate-800 overflow-hidden">
      {sessionState === 'idle' ? renderIdle() : renderActiveOrFinished()}
    </div>
  );
};

export default InterviewPrep;