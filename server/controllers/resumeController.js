// controller for creating a new resume
// POST: /api/resume/create

import imageKit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs, { createReadStream } from "fs";

export const createResume = async (req, res) => {
    try {
        const userID = req.userID;
        const { title } = req.body;
        //create new resume
        const newResume = await Resume.create({ userID, title });
        // return success method
        return res.status(201).json({ message: 'Resume created successfully', resume: newResume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for deleting the resume
//POST: /api/resume/delete

export const deleteResume = async (req, res) => {
    try {
        const userID = req.userID;
        const { resumeID } = req.params;
        await Resume.findOneAndDelete({ userID, _id: resumeID });
        // return success method
        return res.status(201).json({ message: 'Resume Deleted successfully' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


//get user resume by id
//post: /api/resume/get

export const findResumeByID = async (req, res) => {
    try {
        const userID = req.userID;
        const { resumeID } = req.params;
        const resume = await Resume.findOne({ userID, _id: resumeID });
        // return success method
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;
        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// get resume by public id
// GET: /api/resume/public

export const getPublicResumeByID = async (req, res) => {
    try {
        const {resumeID} = req.params;
        const resume = await Resume.findOne({public: true, _id:resumeID})
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for updating the resume title
//PUT: /api/resume/update-title

export const updateResumeTitle = async (req, res) => {
    try {
        const userID = req.userID;
        const { resumeID } = req.params;
        const { title } = req.body;
        const resume = await Resume.findOneAndUpdate({ userID, _id: resumeID }, { title }, { new: true });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        return res.status(200).json({ message: 'Title updated successfully', resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for updating the resume
//PUT: /api/resume/update

export const updateResume = async (req,res) => {
    try {
        const userID = req.userID;
        const {resumeID, resumeData, removeBackground} = req.body
        const image = req.file;
        let resumeDataCopy = JSON.parse(resumeData);
        if(image){
            const imageBufferData = fs.createReadStream(image.path)
            const response = await imageKit.files.upload({
            file: imageBufferData,
            fileName: 'resume.png',
            folder: 'user-resumes',
            transformation: {
                pre: 'w-300, h-300, fo-face, z-0.75' + (removeBackground ? ',e-bgremove':'')
            }
                });
                resumeDataCopy.personal_info.image = response.url
        }
        const resume = await Resume.findOneAndUpdate({userID, _id:resumeID},resumeDataCopy,{new:true})
        return res.status(200).json({message: 'saved successfully', resume})
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
