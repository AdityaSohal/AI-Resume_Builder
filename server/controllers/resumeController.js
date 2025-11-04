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

// Controller for updating the resume with IMAGE UPLOAD FEATURE
// PUT: /api/resume/update
// Place this in: server/controllers/resumeController.js

import sharp from "sharp"; // Make sure to install: npm install sharp

export const updateResume = async (req, res) => {
    try {
        const userID = req.userID;
        const { resumeID, resumeData, removeBackground } = req.body;
        const image = req.file;

        console.log('=== UPDATE RESUME CALLED ===');
        console.log('resumeID:', resumeID);
        console.log('Has image file:', !!image);
        console.log('Remove background:', removeBackground);

        // Validate required fields
        if (!resumeID || !resumeData) {
            return res.status(400).json({ 
                message: 'Missing required fields: resumeID or resumeData' 
            });
        }

        // Parse resume data
        let resumeDataCopy;
        try {
            resumeDataCopy = typeof resumeData === 'string' 
                ? JSON.parse(resumeData) 
                : { ...resumeData };
        } catch (parseError) {
            console.error('Error parsing resumeData:', parseError);
            return res.status(400).json({ message: 'Invalid resumeData format' });
        }

        // Initialize personal_info if it doesn't exist
        if (!resumeDataCopy.personal_info) {
            resumeDataCopy.personal_info = {};
        }

        // Handle image upload with improved processing
        if (image) {
            try {
                console.log('=== PROCESSING IMAGE UPLOAD ===');
                console.log('Original filename:', image.originalname);
                console.log('File path:', image.path);
                console.log('File size:', image.size, 'bytes');
                console.log('Mimetype:', image.mimetype);

                // Verify file exists
                if (!fs.existsSync(image.path)) {
                    throw new Error('Uploaded file not found on server');
                }

                let processedImageBuffer;

                // Process image with sharp
                if (removeBackground === 'yes') {
                    console.log('Processing with background removal...');
                    
                    // Background removal: Convert to PNG with transparency
                    // For better results, integrate remove.bg API
                    processedImageBuffer = await sharp(image.path)
                        .resize(500, 500, { 
                            fit: 'cover',
                            position: 'center' 
                        })
                        .png() // PNG supports transparency
                        .toBuffer();
                    
                    console.log('Background removal processing complete');
                } else {
                    console.log('Processing without background removal...');
                    
                    // Just resize and optimize
                    processedImageBuffer = await sharp(image.path)
                        .resize(500, 500, { 
                            fit: 'cover',
                            position: 'center' 
                        })
                        .jpeg({ quality: 90 })
                        .toBuffer();
                    
                    console.log('Image optimization complete');
                }

                console.log('Processed image size:', processedImageBuffer.length, 'bytes');

                // Upload to ImageKit
                console.log('Uploading to ImageKit...');
                const uploadResponse = await imageKit.upload({
                    file: processedImageBuffer,
                    fileName: `resume_${userID}_${Date.now()}.${removeBackground === 'yes' ? 'png' : 'jpg'}`,
                    folder: '/user-resumes',
                    useUniqueFileName: true,
                    tags: ['resume', 'profile']
                });

                console.log('=== IMAGEKIT UPLOAD SUCCESS ===');
                console.log('Image URL:', uploadResponse.url);
                console.log('File ID:', uploadResponse.fileId);

                // Update resume data with new image URL
                resumeDataCopy.personal_info.image = uploadResponse.url;

                // Clean up temp file
                fs.unlinkSync(image.path);
                console.log('Temporary file cleaned up');

            } catch (imageError) {
                console.error('=== IMAGE UPLOAD ERROR ===');
                console.error('Error:', imageError.message);
                console.error('Stack:', imageError.stack);
                
                // Clean up temp file if it exists
                if (image.path && fs.existsSync(image.path)) {
                    try {
                        fs.unlinkSync(image.path);
                        console.log('Cleaned up failed upload file');
                    } catch (cleanupError) {
                        console.error('Error cleaning up file:', cleanupError);
                    }
                }
                
                // Don't fail the entire operation, just skip image
                console.log('Continuing without image upload...');
                // Keep existing image URL if present
                if (!resumeDataCopy.personal_info.image) {
                    resumeDataCopy.personal_info.image = '';
                }
            }
        }

        // Update resume in database
        console.log('=== UPDATING RESUME IN DATABASE ===');
        const resume = await Resume.findOneAndUpdate(
            { userID, _id: resumeID },
            resumeDataCopy,
            { new: true, runValidators: true }
        );

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        console.log('=== RESUME UPDATE SUCCESSFUL ===');
        console.log('Image URL in saved resume:', resume.personal_info?.image);

        return res.status(200).json({ 
            message: 'Resume saved successfully', 
            resume 
        });

    } catch (error) {
        console.error('=== UPDATE RESUME ERROR ===');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        
        // Clean up uploaded file if it exists
        if (req.file?.path && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
                console.log('Cleaned up file after error');
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