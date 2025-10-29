const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExperienceSchema = new Schema({
    title: String,
    company: String,
    period: String,
    responsibilities: [String],
});

const EducationSchema = new Schema({
    degree: String,
    institution: String,
    period: String,
});

const ResumeSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    linkedin: String,
    summary: String,
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: [String],
    preferences: [String],
    certifications: [String],
    methodologies: [String],
    communityAndWriting: [String],
    careerGoals: [String],
});

const PortfolioProjectSchema = new Schema({
    name: String,
    description: String,
    technologies: [String],
    url: String,
    imageUrl: String,
    role: String,
    outcome: String,
});

const PortfolioSchema = new Schema({
    title: String,
    introduction: String,
    projects: [PortfolioProjectSchema],
});

const JobSuggestionSchema = new Schema({
    title: String,
    company: String,
    location: String,
    description: String,
    matchReason: String,
    applicationUrl: String,
});

const SkillRecommendationSchema = new Schema({
    skill: String,
    reason: String,
    learningResources: [{ name: String, url: String }],
});

const CareerPlanSchema = new Schema({
    resume: ResumeSchema,
    portfolio: PortfolioSchema,
    jobSuggestions: [JobSuggestionSchema],
    skillRecommendations: [SkillRecommendationSchema],
});

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    careerPlan: {
        type: CareerPlanSchema,
        required: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);