import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Resume from "../models/Resume.js";

const generateToken = (userID) => {
    return jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        const token = generateToken(newUser._id);

        const userResponse = newUser.toObject();
        delete userResponse.password;

        return res.status(201).json({
            message: 'User created successfully',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('=== REGISTER ERROR ===');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        return res.status(500).json({ message: 'Internal server error', debug: error.message });
    }
};

// POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('--- LOGIN ATTEMPT ---');
        console.log('Email:', email);
        console.log('JWT_SECRET present:', !!process.env.JWT_SECRET);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        console.log('Step 1: finding user...');
        const user = await User.findOne({ email }).select('+password');
        console.log('Step 2: user found:', !!user);

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        console.log('Step 3: password field present:', !!user.password);
        console.log('Step 4: hash preview:', user.password ? user.password.substring(0, 7) : 'MISSING');

        if (!user.password) {
            console.error('Password field missing from DB for:', email);
            return res.status(500).json({ message: 'Internal server error' });
        }

        console.log('Step 5: running bcrypt.compare...');
        let isMatch;
        try {
            isMatch = await bcrypt.compare(password, user.password);
        } catch (bcryptError) {
            console.error('bcrypt.compare threw:', bcryptError.message);
            return res.status(500).json({ message: 'Internal server error' });
        }

        console.log('Step 6: password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        console.log('Step 7: generating token...');
        const token = generateToken(user._id);
        console.log('Step 8: token generated OK');

        const userResponse = user.toObject();
        delete userResponse.password;

        console.log('--- LOGIN SUCCESS ---');
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('=== LOGIN ERROR (FULL) ===');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        // Send debug message in response so you can read it in the browser Network tab
        return res.status(500).json({ message: 'Internal server error', debug: error.message });
    }
};

// GET: /api/users/data
export const getUserByID = async (req, res) => {
    try {
        const userID = req.userID;
        const user = await User.findById(userID).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// GET: /api/users/resume
export const getUserResume = async (req, res) => {
    try {
        const userID = req.userID;
        const resumes = await Resume.find({ userID });
        return res.status(200).json({ resumes });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};