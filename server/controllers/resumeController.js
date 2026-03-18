import cloudinary from "../configs/cloudinary.js";
import Resume from "../models/Resume.js";

// POST: /api/resume/create
export const createResume = async (req, res) => {
    try {
        const userID = req.userID;
        const { title } = req.body;
        const newResume = await Resume.create({ userID, title });
        return res.status(201).json({ message: 'Resume created successfully', resume: newResume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// DELETE: /api/resume/delete/:resumeID
export const deleteResume = async (req, res) => {
    try {
        const userID = req.userID;
        const { resumeID } = req.params;
        await Resume.findOneAndDelete({ userID, _id: resumeID });
        return res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// GET: /api/resume/:resumeID
export const findResumeByID = async (req, res) => {
    try {
        const userID = req.userID;
        const { resumeID } = req.params;
        const resume = await Resume.findOne({ userID, _id: resumeID });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// GET: /api/resume/public/:resumeID
export const getPublicResumeByID = async (req, res) => {
    try {
        const { resumeID } = req.params;
        const resume = await Resume.findOne({ public: true, _id: resumeID });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// PUT: /api/resume/update-title/:resumeID
export const updateResumeTitle = async (req, res) => {
    try {
        const userID = req.userID;
        const { resumeID } = req.params;
        const { title } = req.body;
        const resume = await Resume.findOneAndUpdate(
            { userID, _id: resumeID },
            { title },
            { new: true }
        );
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        return res.status(200).json({ message: 'Title updated successfully', resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// PUT: /api/resume/update
export const updateResume = async (req, res) => {
    try {
        const userID = req.userID;
        const { resumeID, resumeData } = req.body;
        const imageFile = req.file;

        console.log('=== UPDATE RESUME ===');
        console.log('resumeID:', resumeID);
        console.log('Has image:', !!imageFile);

        if (!resumeID || !resumeData) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let resumeDataCopy;
        try {
            resumeDataCopy = typeof resumeData === 'string' ? JSON.parse(resumeData) : { ...resumeData };
        } catch (e) {
            return res.status(400).json({ message: 'Invalid resumeData format' });
        }

        if (!resumeDataCopy.personal_info) {
            resumeDataCopy.personal_info = {};
        }

        // Handle image upload via Cloudinary
        if (imageFile) {
            console.log('Uploading image to Cloudinary...');
            console.log('File:', imageFile.originalname, '-', imageFile.size, 'bytes');

            try {
                // Cloudinary upload_stream accepts a Buffer via a Promise wrapper
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'resume-builder',
                            resource_type: 'image',
                            // Auto-crop and resize to a square profile photo
                            transformation: [
                                { width: 400, height: 400, crop: 'fill', gravity: 'face' }
                            ]
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(imageFile.buffer);
                });

                console.log('Cloudinary upload success:', uploadResult.secure_url);
                resumeDataCopy.personal_info.image = uploadResult.secure_url;

            } catch (uploadError) {
                console.error('=== CLOUDINARY UPLOAD FAILED ===');
                console.error('Error:', uploadError.message);
                return res.status(400).json({
                    message: `Image upload failed: ${uploadError.message}`
                });
            }
        }

        // Save resume to database
        const resume = await Resume.findOneAndUpdate(
            { userID, _id: resumeID },
            resumeDataCopy,
            { new: true, runValidators: true }
        );

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        console.log('Resume saved successfully');
        return res.status(200).json({ message: 'Resume saved successfully', resume });

    } catch (error) {
        console.error('=== UPDATE RESUME ERROR ===');
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}