import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PortfolioData, PortfolioProject } from '../types';

const GRID_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const FULLSCREEN_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);


const useOnScreen = (options: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting);
      }, options);
  
      const currentRef = ref.current;
      if (currentRef) {
        observer.observe(currentRef);
      }
  
      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, [ref, options]);
  
    return [ref, isVisible] as const;
};

const FullScreenProject: React.FC<{ project: PortfolioProject }> = ({ project }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.4 });
  
    return (
      <section ref={ref} className="h-full w-full scroll-snap-align-start relative flex items-center justify-center p-4" id={`project-${project.name.replace(/\s+/g, '-')}`}>
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out" style={{ backgroundImage: `url(${project.imageUrl})`, transform: isVisible ? 'scale(1)' : 'scale(1.1)' }} aria-hidden="true" />
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" />
        
        <div className={`relative z-10 max-w-5xl w-full transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <p className="text-sm font-bold text-cyber-cyan tracking-widest uppercase mb-2">Featured Project</p>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{project.name}</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="bg-slate-800 text-cyber-cyan px-4 py-1 rounded-full text-sm font-semibold border border-slate-700">{tech}</span>
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed text-base md:text-lg">{project.description}</p>
            </div>
            <div className="space-y-6 bg-slate-900/50 p-6 rounded-lg border border-slate-800">
              <div>
                <h4 className="font-bold text-lg text-white mb-2">My Role & Contributions</h4>
                <p className="text-gray-400">{project.role}</p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-2">Outcome & Impact</h4>
                <p className="text-gray-400">{project.outcome}</p>
              </div>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-block w-full text-center bg-accent hover:bg-accent-hover text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                View Project &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>
    );
};

const GridProject: React.FC<{ project: PortfolioProject }> = ({ project }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    return (
        <div ref={ref} className={`bg-secondary/70 rounded-lg shadow-xl border border-slate-800 overflow-hidden transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <img src={project.imageUrl} alt={project.name} className="w-full h-56 object-cover"/>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{project.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                        <span key={i} className="bg-slate-800 text-cyber-cyan px-3 py-1 rounded-full text-xs font-semibold">{tech}</span>
                    ))}
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:text-cyber-cyan transition-colors">
                    View Project &rarr;
                </a>
            </div>
        </div>
    );
}

interface PortfolioProps {
  data: PortfolioData;
}

const Portfolio: React.FC<PortfolioProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'full' | 'grid'>('full');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // FIX: Changed type from HTMLDivElement to HTMLElement to allow refs from different element types (e.g., header, div).
  const projectRefs = useRef<(HTMLElement | null)[]>([]);

  const uniqueTechs = useMemo(() => {
    const techs = new Set<string>();
    data.projects.forEach(p => p.technologies.forEach(t => techs.add(t.trim())));
    return ['All', ...Array.from(techs)];
  }, [data.projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return data.projects;
    return data.projects.filter(p => p.technologies.includes(activeFilter));
  }, [data.projects, activeFilter]);
  
  useEffect(() => {
    projectRefs.current = projectRefs.current.slice(0, filteredProjects.length + 1);
  }, [filteredProjects]);

  useEffect(() => {
    if (viewMode !== 'full') return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const index = projectRefs.current.findIndex(ref => ref === entry.target);
                if (index !== -1) {
                    setActiveIndex(index);
                }
            }
        });
    }, { threshold: 0.6 });

    projectRefs.current.forEach(ref => {
        if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filteredProjects, viewMode]);

  const handleNavClick = (index: number) => {
    projectRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div className="animate-slide-up">
      <div className="sticky top-[72px] bg-secondary/80 backdrop-blur-md z-30 p-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="text-sm font-semibold text-gray-400 hidden md:block">Filter by:</span>
                {uniqueTechs.map(tech => (
                    <button key={tech} onClick={() => setActiveFilter(tech)} className={`px-3 py-1 text-sm rounded-md transition-colors ${activeFilter === tech ? 'bg-accent text-white font-semibold' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}>
                        {tech}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setViewMode('full')} className={`p-2 rounded-md ${viewMode === 'full' ? 'bg-accent text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}>{FULLSCREEN_ICON}</button>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-accent text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}>{GRID_ICON}</button>
            </div>
        </div>
      </div>

      {viewMode === 'full' ? (
        <>
          <div className="fixed right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-3">
            {[...Array(filteredProjects.length + 1)].map((_, index) => (
                <button key={index} onClick={() => handleNavClick(index)} className={`w-3 h-3 rounded-full border-2 border-cyber-cyan transition-all ${activeIndex === index ? 'bg-cyber-cyan scale-125' : 'bg-transparent'}`} aria-label={`Go to section ${index + 1}`}></button>
            ))}
          </div>

          <div ref={scrollContainerRef} className="h-[calc(100vh-140px)] overflow-y-scroll scroll-snap-type-y mandatory">
            {/* FIX: Used a block statement for the ref callback to ensure it doesn't return a value, and to fix type errors. */}
            <header ref={el => { projectRefs.current[0] = el; }} className="h-full scroll-snap-align-start flex flex-col items-center justify-center text-center p-4 relative">
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wider" style={{ textShadow: '0 0 10px rgba(8, 253, 216, 0.5)' }}>{data.title}</h1>
                <p className="text-gray-400 mt-4 max-w-3xl mx-auto leading-relaxed text-lg">{data.introduction}</p>
                <div className="absolute bottom-10 animate-bounce">
                    <svg className="w-8 h-8 text-cyber-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </header>

            {filteredProjects.map((project, index) => (
                // FIX: Used a block statement for the ref callback to ensure it doesn't return a value.
                <div key={project.name} ref={el => { projectRefs.current[index + 1] = el; }} className="h-full scroll-snap-align-start">
                    <FullScreenProject project={project} />
                </div>
            ))}
          </div>
        </>
      ) : (
        <div className="p-4 sm:p-8 bg-primary">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                    <GridProject key={index} project={project} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
