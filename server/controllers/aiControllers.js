//controller for enhancing professional summary
//post: /api/ai/enhance-pro-sum

import Resume from "../models/Resume.js";
import genAI from "../configs/ai.js";

export const enhanceProfessionalSummary = async (req,res) => {
    try {
        const {userContent} = req.body;
        if(!userContent){
            return res.status(400).json({message:'Missing Required Fields'})
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an expert in resume writing. Your task is to enhance the professional summary of the resume. The summary should be 1-2 sentences also highlighting the key features, skills, experiences, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else. User content: ${userContent}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const enhancedContent = response.text();
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//controller for enhancing job description
//post: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req,res) => {
    try {
        const {userContent} = req.body;
        if(!userContent){
            return res.status(400).json({message:'Missing Required Fields'})
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an expert in resume writing, your task is to enhance this job description of a resume, the job description should only be 1-2 sentences also highlighting key features, responsibilities and achievements. use action verbs and quantifiality results where possible. Make it ATS-friendly and only return text no options or anything else. User content: ${userContent}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const enhancedContent = response.text();
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//controller for uploading resume
//post: /api/ai/upload-resume

export const uploadResume = async (req,res) => {
    try {
        const{resumeText,title} = req.body;
        const userID = req.userID;
        if(!resumeText){
            return res.status(400).json({message:'Missing Required Fields'})
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an expert AI agent to extract data from resume. Extract data from this resume: ${resumeText}. Provide the data in the following JSON format with no additional text before or after:
{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [],
  "projects": [],
  "education": []
}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const extractedData = response.text();
        const parsedData = JSON.parse(extractedData);
        const newResume = await Resume.create({userID, title, ...parsedData})
        res.json({resumeID: newResume._id})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}
