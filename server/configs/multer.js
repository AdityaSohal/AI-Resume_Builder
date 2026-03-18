import multer from 'multer';

// FIX: switched from diskStorage to memoryStorage
// diskStorage + sharp requires platform-specific native binaries that often
// fail silently on Windows. memoryStorage stores the file as a Buffer in
// req.file.buffer, which can be sent directly to ImageKit without any
// intermediate file processing or native dependencies.
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG and PNG images are allowed'), false);
        }
    }
});

export default upload;