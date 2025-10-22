import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Resume from "../models/Resume.js";

const generateToken = (userID) => {
    return jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all fields are present
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = generateToken(newUser._id);

        // Remove password from response
        newUser.password = undefined;

        return res.status(201).json({
            message: 'User created successfully',
            token,
            user: newUser
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare passwords using the model's method
        const isMatch = user.comparePasswords(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        user.password = undefined;

        return res.status(200).json({
            message: 'Login successful',
            token,
            user
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// controller to get user by id
// GET: /api/user/data

export const getUserByID = async (req, res) => {
    try {
        const userID = req.userID;
        // check if the user exists
        const user = await User.findById(userID)
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        // return user
        user.password = undefined;
        return res.status(200).json({user});

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// controller to get user resume
// GET: /api/user/resume

export const getUserResume = async(req,res) =>{
try {
    const userID = req.userID;

    const resumes = await Resume.find({userID})
    return res.status(200).json({resumes})
} catch (error) {
    return res.status(400).json({ message: error.message });
}
};
