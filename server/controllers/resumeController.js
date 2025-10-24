// controller for creating a new resume
// POST: /api/resume/create

import imageKit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";
import { createReadStream } from "fs";

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
//DELETE: /api/resume/delete/:resumeID

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
//GET: /api/resume/:resumeID

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
// GET: /api/resume/public/:resumeID

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
//PUT: /api/resume/update-title/:resumeID

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

export const updateResume = async (req, res) => {
    try {
        const userID = req.userID;
        const { resumeID, resumeData, removeBackground } = req.body;
        const image = req.file;

        console.log('Update resume called');
        console.log('resumeID:', resumeID);
        console.log('Has image file:', !!image);
        console.log('Remove background:', removeBackground);

        // Validate required fields
        if (!resumeID || !resumeData) {
            return res.status(400).json({ message: 'Missing required fields: resumeID or resumeData' });
        }

        // Parse resume data
        let resumeDataCopy;
        try {
            if (typeof resumeData === 'string') {
                resumeDataCopy = JSON.parse(resumeData);
            } else {
                resumeDataCopy = { ...resumeData };
            }
        } catch (parseError) {
            console.error('Error parsing resumeData:', parseError);
            return res.status(400).json({ message: 'Invalid resumeData format' });
        }

        // Handle image upload
        if (image) {
            try {
                console.log('Processing image upload...');
                console.log('Image path:', image.path);
                console.log('Image mimetype:', image.mimetype);
                console.log('Image size:', image.size);

                // Check if file exists
                if (!fs.existsSync(image.path)) {
                    throw new Error('Uploaded file not found on server');
                }

                // Read the file as buffer
                const imageBuffer = fs.readFileSync(image.path);

                console.log('Uploading to ImageKit without transformation');

                // Upload to ImageKit
                const response = await imageKit.upload({
                    file: imageBuffer,
                    fileName: `resume_${Date.now()}.png`,
                    folder: 'user-resumes'
                });

                console.log('ImageKit upload successful:', response.url);

                // Update resume data with new image URL
                resumeDataCopy.personal_info = resumeDataCopy.personal_info || {};
                resumeDataCopy.personal_info.image = response.url;

                console.log('Image uploaded and URL set:', response.url);

                // Clean up uploaded file
                fs.unlinkSync(image.path);
                console.log('Temporary file cleaned up');

            } catch (imageError) {
                console.error('Image upload error:', imageError);
                // Clean up file if it exists
                if (image.path && fs.existsSync(image.path)) {
                    fs.unlinkSync(image.path);
                }
                // Continue without image - don't fail the entire save operation
                resumeDataCopy.personal_info.image = '';
                console.log('Continuing resume save without image upload');
            }
        }

        // Update resume in database
        const resume = await Resume.findOneAndUpdate(
            { userID, _id: resumeID },
            resumeDataCopy,
            { new: true }
        );

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        console.log('Resume updated successfully');
        return res.status(200).json({ message: 'Saved successfully', resume });

    } catch (error) {
        console.error('Update resume error:', error);
        // Clean up uploaded file if it exists
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.error('Error cleaning up file:', cleanupError);
            }
        }
        return res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message 
        });
    }
}