require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenAI, Type } = require('@google/genai');

const User = require('./models/User');
const auth = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- DB Connection ---
if (!process.env.MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined.');
    process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });


// --- Gemini AI Setup ---
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: 'Please enter all fields' });
        
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token, user: { id: user.id, email: user.email } });
        });
    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: 'Please enter all fields' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, email: user.email } });
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send('Server error');
    }
});

// --- Plan Routes ---
app.get('/api/plan', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user.careerPlan) {
            return res.json(null);
        }
        res.json(user.careerPlan);
    } catch (err) {
        console.error('Get plan error:', err.message);
        res.status(500).send('Server Error');
    }
});

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


app.post('/api/plan/generate', auth, async (req, res) => {
    const { userInput, isThinkingMode } = req.body;
    if (!userInput) {
        return res.status(400).json({ msg: 'User input is required.' });
    }

    try {
        const modelName = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
        const thinkingConfig = isThinkingMode ? { thinkingBudget: 32768 } : {};
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

        const plan = JSON.parse(response.text.trim());
        
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found.' });
        
        user.careerPlan = plan;
        await user.save();
        res.json(plan);

    } catch (err) {
        console.error('Generation error:', err.message);
        res.status(500).send('Server Error during generation.');
    }
});

// --- Chat Route ---
app.post('/api/chat', auth, async (req, res) => {
    const { messages } = req.body;
     if (!messages || messages.length === 0) {
        return res.status(400).json({ msg: 'Messages are required.' });
    }
    
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
        res.json({ response: response.text });
     } catch(err) {
        console.error('Chat error:', err.message);
        res.status(500).send('Chat error');
     }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));