

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  preferences?: string[];
  certifications?: string[];
  methodologies?: string[];
  communityAndWriting?: string[];
  careerGoals?: string[];
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
}

export interface PortfolioProject {
  name: string;
  description: string;
  technologies: string[];
  url: string;
  imageUrl: string;
  role: string;
  outcome: string;
}

export interface PortfolioData {
  title: string;
  introduction: string;
  projects: PortfolioProject[];
}

export interface JobSuggestion {
  title: string;
  company: string;
  location: string;
  description: string;
  matchReason: string;
  applicationUrl: string;
  status?: 'Not Applied' | 'Applied' | 'Interviewing';
}

export interface SkillRecommendation {
  skill: string;
  reason: string;
  learningResources: { name: string; url: string }[];
  progress?: number;
}

export interface CareerPlan {
  resume: ResumeData;
  portfolio: PortfolioData;
  jobSuggestions: JobSuggestion[];
  skillRecommendations: SkillRecommendation[];
}

export enum ActiveTab {
  Resume = 'Resume',
  Portfolio = 'Portfolio',
  Jobs = 'Jobs',
  Skills = 'Skills',
  Interview = 'Interview',
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}