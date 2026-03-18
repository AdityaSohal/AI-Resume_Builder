import mongoose from 'mongoose'

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/resume-builder`)
        console.log('Database Connected Successfully')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message)
        throw error
    }
}

export default connectDB