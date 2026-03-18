import dotenv from 'dotenv'
dotenv.config()

import { v2 as cloudinary } from 'cloudinary'

console.log('=== CLOUDINARY CONFIG ===')
console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'MISSING')
console.log('API_KEY:', process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.substring(0, 6) + '...' : 'MISSING')
console.log('API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'present' : 'MISSING')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary