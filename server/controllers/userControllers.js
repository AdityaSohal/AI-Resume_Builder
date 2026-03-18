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

        // FIX: use toObject() and delete from the plain object
        // Never mutate a mongoose document (newUser.password = undefined) — it can corrupt
        // the mongoose identity map and cause subsequent findOne calls to return password: undefined
        const userResponse = newUser.toObject();
        delete userResponse.password;

        return res.status(201).json({
            message: 'User created successfully',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // FIX: explicitly select password field — even though there's no `select: false` on the
        // schema, being explicit prevents issues if the schema ever changes, and ensures we always
        // get the field we need for bcrypt comparison
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // FIX: guard against missing password hash before calling bcrypt.compare
        // bcrypt.compare(anything, undefined) throws "data and hash arguments required"
        // which was causing the 500 — the error escaped the try/catch in the old version
        // because bcrypt v6 throws a typed error that wasn't being re-caught properly
        if (!user.password) {
            console.error('Login error: user found but password field is missing for:', email);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // FIX: wrap bcrypt.compare in its own try/catch — it can throw (not just reject)
        // when given bad input, and that throw was propagating past the outer catch as a 500
        let isMatch;
        try {
            isMatch = await bcrypt.compare(password, user.password);
        } catch (bcryptError) {
            console.error('bcrypt.compare error:', bcryptError.message);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        // FIX: use toObject() + delete instead of direct property mutation
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
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