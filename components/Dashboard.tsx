

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { CareerPlan, ActiveTab } from '../types';
import { ICONS, DOWNLOAD_ICON } from '../constants';
import Resume from './Resume';
import Portfolio from './Portfolio';
import JobSuggestions from './JobSuggestions';
import SkillRecommendations from './SkillRecommendations';
import ResumePrintable from './ResumePrintable';
import InterviewPrep from './InterviewPrep';
import OutreachGenerator from './OutreachGenerator';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface DashboardProps {
  data: CareerPlan;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, activeTab, setActiveTab }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [resumeTemplate, setResumeTemplate] = useState('cyberpunk');
  const [portfolioTemplate, setPortfolioTemplate] = useState('cyberpunk');

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '210mm'; // A4 width
    document.body.appendChild(tempContainer);

    const root = ReactDOM.createRoot(tempContainer);
    root.render(<ResumePrintable data={data.resume} />);

    // Allow time for rendering
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        windowWidth: tempContainer.scrollWidth,
        windowHeight: tempContainer.scrollHeight,
    });
    
    root.unmount();
    document.body.removeChild(tempContainer);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const canvasAspectRatio = canvasWidth / canvasHeight;
    const pdfAspectRatio = pdfWidth / pdfHeight;

    let finalCanvasHeight = canvasHeight;
    if (canvasAspectRatio < pdfAspectRatio) {
        finalCanvasHeight = canvasWidth / pdfAspectRatio;
    }
    
    const totalPdfPages = Math.ceil(finalCanvasHeight / (pdfHeight * (canvasWidth / pdfWidth)));
    let position = 0;

    for (let i = 0; i < totalPdfPages; i++) {
        if (i > 0) {
            pdf.addPage();
        }
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = pdfHeight * (canvasWidth/pdfWidth);
        const pageCtx = pageCanvas.getContext('2d');
        if(pageCtx){
          pageCtx.drawImage(canvas, 0, position, canvasWidth, pageCanvas.height, 0, 0, pageCanvas.width, pageCanvas.height);
          pdf.addImage(pageCanvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, pdfWidth, pdfHeight);
          position += pageCanvas.height;
        }
    }
    
    pdf.save(`${activeTab.toLowerCase()}_${data.resume.name.replace(/\s/g, '_')}.pdf`);
    setIsExporting(false);
  };
    
  const renderContent = () => {
    switch (activeTab) {
      case ActiveTab.Resume:
        return <Resume data={data.resume} />;
      case ActiveTab.Portfolio:
        return <Portfolio data={data.portfolio} />;
      case ActiveTab.Jobs:
        return <JobSuggestions data={data.jobSuggestions} />;
      case ActiveTab.Skills:
        return <SkillRecommendations data={data.skillRecommendations} />;
      case ActiveTab.Interview:
        return <InterviewPrep careerPlan={data} />;
      case ActiveTab.Outreach:
        return <OutreachGenerator careerPlan={data} />;
      default:
        return null;
    }
  };
  
  const renderTemplateSelector = () => {
    if (activeTab === ActiveTab.Resume) {
        return (
            <div>
                 <span className="text-sm text-gray-400 mr-2">Template:</span>
                 <button className={`text-sm px-3 py-1 rounded-md ${resumeTemplate === 'cyberpunk' ? 'bg-accent text-white' : 'bg-slate-800'}`} onClick={() => setResumeTemplate('cyberpunk')}>Cyberpunk</button>
            </div>
        )
    }
     if (activeTab === ActiveTab.Portfolio) {
        return (
            <div>
                 <span className="text-sm text-gray-400 mr-2">Template:</span>
                 <button className={`text-sm px-3 py-1 rounded-md ${portfolioTemplate === 'cyberpunk' ? 'bg-accent text-white' : 'bg-slate-800'}`} onClick={() => setPortfolioTemplate('cyberpunk')}>Cyberpunk</button>
            </div>
        )
    }
    return null;
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-8 animate-fade-in">
      <div className="bg-secondary/50 backdrop-blur-sm rounded-lg shadow-2xl border border-slate-800">
        <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {Object.values(ActiveTab).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 border-b-2 ${
                  activeTab === tab 
                  ? 'bg-accent/20 border-cyber-cyan text-cyber-cyan' 
                  : 'bg-primary/50 hover:bg-slate-800 border-transparent text-gray-300'
                }`}
              >
                {ICONS[tab]}
                <span>{tab}</span>
              </button>
            ))}
          </div>
          {(activeTab === ActiveTab.Resume || activeTab === ActiveTab.Portfolio) && renderTemplateSelector()}
          {activeTab === ActiveTab.Resume && (
            <button 
                onClick={handleExport}
                disabled={isExporting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {DOWNLOAD_ICON}
                {isExporting ? 'Exporting...' : `Export ${activeTab} to PDF`}
            </button>
          )}
        </div>
        <div className="p-4 sm:p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;