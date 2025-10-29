

import { GoogleGenAI, Type } from '@google/genai';
import { CareerPlan, ChatMessage, OutreachContent } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        resume: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "User's full name" },
                email: { type: Type.STRING, description: "User's email address" },
                phone: { type: Type.STRING, description: "User's phone number" },
                linkedin: { type: Type.STRING, description: "URL to user's LinkedIn profile" },
                summary: { type: Type.STRING, description: "A professional summary of 2-4 sentences." },
                experience: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            company: { type: Type.STRING },
                            period: { type: Type.STRING, description: "e.g., 'Jan 2020 - Present'" },
                            responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                         required: ["title", "company", "period", "responsibilities"],
                    },
                },
                education: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            degree: { type: Type.STRING },
                            institution: { type: Type.STRING },
                            period: { type: Type.STRING, description: "e.g., 'Aug 2016 - May 2020'" },
                        },
                        required: ["degree", "institution", "period"],
                    },
                },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                preferences: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "User's work preferences, e.g., 'Remote/Hybrid', 'Willing to relocate', desired company culture."
                },
                certifications: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of professional certifications, e.g., 'AWS Certified Solutions Architect'."
                },
                methodologies: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Development methodologies the user is familiar with, e.g., 'Agile', 'Scrum', 'Kanban'."
                },
                communityAndWriting: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Contributions to open-source projects, blogs, or other community involvement."
                },
                careerGoals: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "User's short-term and long-term career goals, target roles, or learning paths."
                },
            },
            required: ["name", "email", "phone", "linkedin", "summary", "experience", "education", "skills"],
        },
        portfolio: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "A catchy title for the portfolio." },
                introduction: { type: Type.STRING, description: "A brief introduction about the user's professional self." },
                projects: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                            url: { type: Type.STRING, description: "URL to the live project or repository." },
                            imageUrl: { type: Type.STRING, description: "URL for a relevant project image or placeholder (e.g., 'https://picsum.photos/seed/project-name/1920/1080')." },
                            role: { type: Type.STRING, description: "The user's specific role and key contributions on the project." },
                            outcome: { type: Type.STRING, description: "The tangible outcome or impact of the project, including metrics if possible (e.g., 'Increased user engagement by 15%')." },
                        },
                        required: ["name", "description", "technologies", "url", "imageUrl", "role", "outcome"],
                    },
                },
            },
            required: ["title", "introduction", "projects"],
        },
        jobSuggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    description: { type: Type.STRING },
                    matchReason: { type: Type.STRING, description: "Why this job is a good fit." },
                    applicationUrl: { type: Type.STRING, description: "A plausible example URL to apply." }
                },
                required: ["title", "company", "location", "description", "matchReason", "applicationUrl"],
            },
        },
        skillRecommendations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING },
                    reason: { type: Type.STRING, description: "Why this skill is important for the user's goals." },
                    learningResources: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: {type: Type.STRING},
                                url: {type: Type.STRING},
                            },
                            required: ["name", "url"]
                        },
                        description: "A list of 2-3 online resources to learn this skill."
                    }
                },
                required: ["skill", "reason", "learningResources"],
            },
        },
    },
    required: ["resume", "portfolio", "jobSuggestions", "skillRecommendations"],
};


export const generateCareerPlan = async (userInput: string, isThinkingMode: boolean): Promise<CareerPlan> => {
    const modelName = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const thinkingConfig = isThinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};
    const systemInstruction = `You are CareerCraft AI, an expert career advisor. Analyze the user's background and goals to generate a comprehensive career plan. Crucially, derive 2-4 detailed portfolio projects directly from the user's work experience in their resume. For each project, provide:
1. A project name.
2. A detailed description of the project.
3. The user's specific role and key contributions.
4. The tangible outcome or impact of the project (e.g., increased efficiency, user growth).
5. The technologies used.
6. For the 'imageUrl', generate a highly relevant placeholder URL from a service like picsum.photos using a descriptive, URL-friendly seed based on the project content (e.g., 'https://picsum.photos/seed/finance-dashboard-ui/1920/1080') to get a professional-looking UI/UX screenshot, mockup, or a relevant conceptual image. Use high resolution images (e.g., 1920/1080).
If the user mentions preferences like remote work, relocation, company culture, certifications, methodologies, community contributions, or specific career goals, include these in the appropriate sections of the resume. Provide the output ONLY in a valid JSON format that matches the provided schema. Do not include any markdown formatting like \`\`\`json.`;
    const prompt = `Based on the following user description, please generate a complete career plan. Be thorough and professional.\n\n---\n\n${userInput}\n\n---`;

    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            ...thinkingConfig,
        },
    });

    try {
      const plan = JSON.parse(response.text.trim());
      return plan;
    } catch(e) {
      console.error("Failed to parse Gemini response:", response.text);
      throw new Error("The AI returned an invalid response. Please try again.");
    }
};

export const chatWithBot = async (messages: ChatMessage[]): Promise<string> => {
    const history = messages.slice(0, -1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));
    const message = messages[messages.length - 1].content;

     try {
        const model = 'gemini-2.5-flash';
        const chat = ai.chats.create({
            model,
            config: {
                systemInstruction: "You are a friendly and helpful career assistant chatbot for CareerCraft AI.",
            },
            history,
        });
        const response = await chat.sendMessage({ message });
        return response.text;
     } catch(err) {
        console.error('Chat error:', err);
        throw new Error('An error occurred in the chat service.');
     }
};

export const getInterviewResponse = async (messages: ChatMessage[], careerPlan: CareerPlan): Promise<string> => {
    const history = messages.slice(0, -1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));
    const message = messages[messages.length - 1].content;

    const systemInstruction = `You are an expert interviewer hiring for roles like '${careerPlan.resume.careerGoals?.join(', ') || 'a senior software engineer'}'. Your task is to conduct a mock interview.
- If the user sends the initial message 'start', you MUST ask the first interview question.
- When the user provides an answer to a question, you MUST respond with two parts separated by the unique delimiter '|||':
  1.  First part: Concise, constructive feedback on their answer (2-3 sentences max).
  2.  Second part: The next interview question.
- Conduct a total of 5 questions. Your questions should be a mix of behavioral and technical questions relevant to the user's goals.
- After the user provides their 5th answer, your response MUST be the feedback for that final answer, followed by the delimiter '|||', and then a final summary paragraph. The summary should highlight the user's performance with 2-3 key strengths and 2-3 areas for improvement.
- Do not add any conversational filler like "Great, let's move on." Just provide the content as requested.`;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
        history,
    });
    const response = await chat.sendMessage({ message });
    return response.text;
};

const outreachSchema = {
    type: Type.OBJECT,
    properties: {
        elevatorPitch: { 
            type: Type.STRING, 
            description: "A compelling 30-second elevator pitch (2-4 sentences) summarizing the user's professional identity and goals." 
        },
        linkedinMessage: { 
            type: Type.STRING, 
            description: "A concise and professional message (3-5 sentences) for a LinkedIn connection request to a recruiter or professional in their target field. It should be personalized and state the purpose of connecting." 
        },
        informationalInterviewEmail: { 
            type: Type.STRING, 
            description: "A professional and respectful email template to request an informational interview. It should have a clear subject line, introduce the user, state the reason for outreach, and propose a brief meeting. Use placeholders like [Their Name] and [Company Name]." 
        },
    },
    required: ["elevatorPitch", "linkedinMessage", "informationalInterviewEmail"],
};

export const generateOutreachContent = async (careerPlan: CareerPlan): Promise<OutreachContent> => {
    const systemInstruction = `You are a career coach and networking expert. Based on the user's career plan, generate tailored content for professional outreach. The tone should be confident, professional, and approachable. Ensure the output is a valid JSON object matching the provided schema. Do not include any markdown formatting.`;
    const prompt = `Here is the user's career plan. Generate an elevator pitch, a LinkedIn connection request message, and an informational interview request email based on this information.
---
Resume Summary: ${careerPlan.resume.summary}
Career Goals: ${careerPlan.resume.careerGoals?.join(', ')}
Target Roles: ${careerPlan.jobSuggestions.map(j => j.title).slice(0,2).join(', ')}
---`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: outreachSchema,
        },
    });

    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini response for outreach content:", response.text);
        throw new Error("The AI returned an invalid response for outreach content.");
    }
};


// FIX: Add login and register functions to resolve import errors in Auth.tsx.
export const login = async (email: string, password: string): Promise<{ token: string }> => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
    }
    return data;
};

export const register = async (email: string, password: string): Promise<{ token: string }> => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.msg || 'Registration failed');
    }
    return data;
};