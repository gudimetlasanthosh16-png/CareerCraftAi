
import React, { useState } from 'react';
import Header from './components/Header';
import IntroductionForm from './components/IntroductionForm';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import IntroVideo from './components/IntroVideo';
import { generateCareerPlan } from './services/geminiService';
import { CareerPlan, ActiveTab } from './types';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [careerPlan, setCareerPlan] = useState<CareerPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Resume);

  const handleReset = () => {
    setCareerPlan(null);
    setError(null);
    setActiveTab(ActiveTab.Resume);
  };

  const handleGenerate = async (userInput: string, isThinkingMode: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateCareerPlan(userInput, isThinkingMode);
      setCareerPlan(plan);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating your career plan. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (careerPlan) {
      return <Dashboard data={careerPlan} activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
    return <IntroductionForm onSubmit={handleGenerate} isLoading={isLoading} />;
  }

  if (showIntro) {
    return <IntroVideo onFinished={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-primary bg-[radial-gradient(#2d333b_1px,transparent_1px)] [background-size:16px_16px] animate-fade-in">
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/50 to-primary">
        <Header onReset={handleReset} showResetButton={!!careerPlan} />
        <main className="py-8">
          {error && (
              <div className="container max-w-4xl mx-auto px-4 sm:px-8 pb-4 animate-fade-in">
                  <p className="text-center bg-red-900/50 text-red-300 p-3 rounded-md border border-red-700">{error}</p>
              </div>
          )}
          {renderContent()}
        </main>
        {careerPlan && <Chatbot />}
      </div>
    </div>
  );
};

export default App;
