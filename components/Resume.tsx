import React from 'react';
import { ResumeData } from '../types';

interface ResumeProps {
  data: ResumeData;
}

const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold text-cyber-cyan border-b-2 border-cyber-cyan/30 pb-2 mb-4 tracking-wider" style={{ textShadow: '0 0 5px rgba(8, 253, 216, 0.5)' }}>
      {title}
    </h2>
    {children}
  </section>
);

const Resume: React.FC<ResumeProps> = ({ data }) => {
  return (
    <div className="bg-secondary/70 p-8 rounded-lg shadow-xl animate-slide-up border border-slate-800">
      <header className="text-center pb-6 mb-6">
        <h1 className="text-5xl font-bold text-white tracking-wide">{data.name}</h1>
        <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 mt-3 text-gray-400">
          <span>{data.email}</span>
          <span className="hidden sm:inline">&bull;</span>
          <span>{data.phone}</span>
          <span className="hidden sm:inline">&bull;</span>
          <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:underline">{data.linkedin.replace('https://www.','')}</a>
        </div>
      </header>

      <Section title="PROFESSIONAL SUMMARY">
        <p className="text-gray-300 leading-relaxed">{data.summary}</p>
      </Section>
      
      <Section title="WORK EXPERIENCE">
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-6 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-cyber-cyan before:rounded-full">
            <h3 className="text-xl font-bold text-white">{exp.title}</h3>
            <div className="flex justify-between items-baseline">
              <p className="text-lg text-gray-300 font-medium">{exp.company}</p>
              <p className="text-sm text-gray-500">{exp.period}</p>
            </div>
            <ul className="list-disc list-inside mt-2 text-gray-400 space-y-1 pl-2">
              {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
            </ul>
          </div>
        ))}
      </Section>

      <Section title="EDUCATION">
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-cyber-cyan before:rounded-full">
            <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
             <div className="flex justify-between items-baseline">
                <p className="text-lg text-gray-300 font-medium">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.period}</p>
            </div>
          </div>
        ))}
      </Section>

      <Section title="SKILLS">
        <div className="flex flex-wrap gap-3">
          {data.skills.map((skill, index) => (
            <span key={index} className="bg-slate-800 text-cyber-cyan px-4 py-1 rounded-full text-sm font-semibold border border-slate-700 transition-all hover:bg-cyber-cyan hover:text-primary hover:shadow-lg hover:shadow-cyber-cyan/20">
              {skill}
            </span>
          ))}
        </div>
      </Section>

      {data.certifications && data.certifications.length > 0 && (
        <Section title="CERTIFICATIONS">
          <div className="flex flex-wrap gap-3">
            {data.certifications.map((cert, index) => (
              <span key={index} className="bg-slate-800 text-gray-300 px-4 py-1 rounded-full text-sm font-semibold border border-slate-700">
                {cert}
              </span>
            ))}
          </div>
        </Section>
      )}
      
      {data.methodologies && data.methodologies.length > 0 && (
        <Section title="METHODOLOGIES">
          <div className="flex flex-wrap gap-3">
            {data.methodologies.map((method, index) => (
              <span key={index} className="bg-slate-800 text-gray-300 px-4 py-1 rounded-full text-sm font-semibold border border-slate-700">
                {method}
              </span>
            ))}
          </div>
        </Section>
      )}

      {data.communityAndWriting && data.communityAndWriting.length > 0 && (
        <Section title="COMMUNITY & WRITING">
          <ul className="list-disc list-inside mt-2 text-gray-400 space-y-1 pl-2">
            {data.communityAndWriting.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </Section>
      )}

      {data.careerGoals && data.careerGoals.length > 0 && (
        <Section title="CAREER GOALS">
          <ul className="list-disc list-inside mt-2 text-gray-400 space-y-1 pl-2">
            {data.careerGoals.map((goal, i) => <li key={i}>{goal}</li>)}
          </ul>
        </Section>
      )}

      {data.preferences && data.preferences.length > 0 && (
        <Section title="PREFERENCES">
          <div className="flex flex-wrap gap-3">
            {data.preferences.map((preference, index) => (
              <span key={index} className="bg-slate-800 text-gray-300 px-4 py-1 rounded-full text-sm font-semibold border border-slate-700">
                {preference}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default Resume;