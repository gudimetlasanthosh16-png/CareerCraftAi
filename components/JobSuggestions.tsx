import React, { useState } from 'react';
import { JobSuggestion } from '../types';

interface JobSuggestionsProps {
  data: JobSuggestion[];
}

const JobSuggestions: React.FC<JobSuggestionsProps> = ({ data }) => {
  const [jobs, setJobs] = useState<JobSuggestion[]>(data.map(job => ({...job, status: 'Not Applied'})));

  const updateStatus = (index: number, status: JobSuggestion['status']) => {
    const newJobs = [...jobs];
    newJobs[index].status = status;
    setJobs(newJobs);
  };
  
  const getStatusClasses = (status: JobSuggestion['status']) => {
    switch (status) {
        case 'Applied': return 'from-blue-500 to-indigo-600';
        case 'Interviewing': return 'from-yellow-500 to-orange-600';
        default: return 'from-gray-600 to-gray-700';
    }
  }

  return (
    <div className="bg-secondary/70 p-8 rounded-lg shadow-xl animate-slide-up border border-slate-800">
      <header className="border-b-2 border-cyber-cyan/30 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-white">Recommended Job Openings</h1>
        <p className="text-gray-400 mt-1">Based on your profile, here are some roles that could be a great fit.</p>
      </header>

      <div className="space-y-6">
        {jobs.map((job, index) => (
          <div key={index} className="bg-slate-900/80 rounded-lg p-6 border border-slate-800 transition-all duration-300 hover:border-cyber-cyan/50 hover:shadow-xl hover:shadow-cyber-cyan/10">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">{job.title}</h3>
                    <p className="text-lg text-gray-300">{job.company} - <span className="text-gray-400">{job.location}</span></p>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r ${getStatusClasses(job.status)}`}>{job.status}</span>
                </div>
            </div>
            
            <p className="text-gray-400 mb-2"><strong className="text-gray-200">Why it's a match:</strong> {job.matchReason}</p>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">{job.description}</p>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-800 pt-4 mt-4">
                <div className="flex items-center space-x-2">
                    <button onClick={() => updateStatus(index, 'Applied')} className="text-sm bg-blue-600/50 hover:bg-blue-600 border border-blue-600 text-white py-1 px-3 rounded-md transition-colors">Applied</button>
                    <button onClick={() => updateStatus(index, 'Interviewing')} className="text-sm bg-yellow-600/50 hover:bg-yellow-600 border border-yellow-600 text-white py-1 px-3 rounded-md transition-colors">Interviewing</button>
                    <button onClick={() => updateStatus(index, 'Not Applied')} className="text-sm bg-gray-600/50 hover:bg-gray-600 border border-gray-600 text-white py-1 px-3 rounded-md transition-colors">Reset</button>
                </div>
                <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-lg text-sm transition-transform transform hover:scale-105">
                View & Apply
                </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSuggestions;