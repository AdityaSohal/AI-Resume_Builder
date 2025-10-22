//controller for enhancing professional summary
//post: /api/ai/enchance-pro-sum

import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

export const enchanceProfessionalSummary = async (req,res) => {
    try {
        const {userContent} = req.body;
        if(!userContent){
            return res.status(400).json({message:'Missing Required Fields'})
        }
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                    { role: "system", content: "You are an expert in resume writing. Your task is to enchance the professional summary of the resume. The summary should be 1-2 sentences also highlighting the key features, skills, experiences, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else " },
                    {
                    role: "user",
                    content: userContent,
        },
    ],
        })
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//controller for enhancing job description
//post: /api/ai/enchance-job-desc

export const enchanceJobDescription = async (req,res) => {
    try {
        const {userContent} = req.body;
        if(!userContent){
            return res.status(400).json({message:'Missing Required Fields'})
        }
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                    { role: "system",
                    content: "you are an expert in resume writing, your task is to enhance this job description of a resume, the job description should only be 1-2 sentences also highlighting key features, responsibilities and achievements. use action verbs and quantifiality results where possible. Make it ATS-friendly and only return text no options or anyting else" },
                    {
                    role: "user",
                    content: userContent,
        },
    ],
        })
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//controller for uploading resume
//post: /api/ai/uploadresume

export const uploadResume = async (req,res) => {
    try {
        const{resumeText,title} = req.body;
        const userID = req.userID;
        if(!resumeText){
            return res.status(400).json({message:'Missing Required Fields'})
        }
        const systemPrompt = "You are an expert AI agent to extract data from resume"
        const userPrompt = `extract data from this resume: ${resumeText}
        provide the data in the following JSON format with no additional text before or after :
        professional_summary : {type: String, default: ''},

    skills : [{type: String}],
    personal_info : {
        image:{type:String, default:''},
        full_name:{type:String, default:''},
        profession: {type:String, default:''},
        email:{type:String, default:''},
        phone:{type:String, default:''},
        location:{type:String, default:''},
        linkedin:{type:String, default:''},
        website:{type:String, default:''},
    },
    experience : [
        {
            company: {type: String, default:''},
            position:{type: String, default:''},
            start_date:{type: String, default:''},
            end_date:{type: String, default:''},
            description:{type: String, default:''},
            is_current:{type: Boolean,},
        }
    ],
    projects : [
        {
            name: {type: String},
            type:{type: String},
            description:{type: String},
        }
    ],
    education : [
        {
            institution: {type: String},
            degree:{type: String},
            field:{type: String},
            graduation_date:{type: String},
            gpa:{type: String},
        }
    ],`

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                    { role: "system",
                    content: systemPrompt},
                    {
                    role: "user",
                    content: userPrompt,
        },
    ],
    response_format:{type: 'json_object'}
        })
        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData)
        const newResume = await Resume.create({userID, title, ...parsedData})
        res.json({resumeID: newResume._id})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}
