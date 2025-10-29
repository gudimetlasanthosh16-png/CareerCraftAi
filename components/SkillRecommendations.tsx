import React, { useState } from 'react';
import { SkillRecommendation } from '../types';

interface SkillRecommendationsProps {
  data: SkillRecommendation[];
}

const SkillRecommendations: React.FC<SkillRecommendationsProps> = ({ data }) => {
  const [skills, setSkills] = useState<SkillRecommendation[]>(data.map(skill => ({...skill, progress: 0})));

  const updateProgress = (index: number, value: number) => {
    const newSkills = [...skills];
    newSkills[index].progress = value;
    setSkills(newSkills);
  };

  return (
    <div className="bg-secondary/70 p-8 rounded-lg shadow-xl animate-slide-up border border-slate-800">
      <header className="border-b-2 border-cyber-cyan/30 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-white">Skills to Sharpen</h1>
        <p className="text-gray-400 mt-1">Level up your profile by learning these recommended skills.</p>
      </header>

      <div className="space-y-6">
        {skills.map((skill, index) => (
          <div key={index} className="bg-slate-900/80 rounded-lg p-6 border border-slate-800 transition-all duration-300 hover:border-cyber-cyan/50">
            <h3 className="text-xl font-bold text-white">{skill.skill}</h3>
            <p className="text-gray-400 my-2">{skill.reason}</p>
            
            <div className="my-4">
                <h4 className="font-semibold text-gray-300 mb-2">Learning Resources:</h4>
                <ul className="list-disc list-inside text-cyber-cyan space-y-1">
                    {skill.learningResources.map((res, i) => (
                        <li key={i}><a href={res.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-400 transition-colors hover:text-cyber-cyan">{res.name}</a></li>
                    ))}
                </ul>
            </div>

            <div className="mt-6">
              <label htmlFor={`progress-${index}`} className="block text-sm font-medium text-gray-300 mb-2">
                Track Your Progress: <span className="font-bold text-cyber-cyan">{skill.progress}%</span>
              </label>
              <input 
                id={`progress-${index}`}
                type="range" 
                min="0" 
                max="100" 
                step="25"
                value={skill.progress}
                onChange={(e) => updateProgress(index, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-input"
                style={{
                  background: `linear-gradient(to right, #08fdd8 0%, #08fdd8 ${skill.progress}%, #374151 ${skill.progress}%, #374151 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Not Started</span>
                <span>In Progress</span>
                <span>Mastered</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillRecommendations;