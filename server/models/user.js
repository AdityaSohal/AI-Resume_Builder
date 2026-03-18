import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // FIX: select: false means password is NEVER returned by default in any query
    // To get it, you must explicitly call .select('+password')
    // This prevents accidental password leaks in any findOne/find call
    password: { type: String, required: true, select: false },
}, { timestamps: true })

// Keep the instance method for potential future use, but the controller
// uses bcrypt.compare directly which is fine
userSchema.methods.comparePasswords = function (password) {
    // FIX: was bcrypt.compareSync — use async version to avoid blocking the event loop
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema)
export default User;