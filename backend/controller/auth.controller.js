const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                message: "Username and password are required" 
            });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ 
                message: "Invalid credentials" 
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: "Invalid credentials" 
            });
        }

        const token = generateToken(user._id);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            message: "Server error" 
        });
    }
};

const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                message: "Username and password are required" 
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ 
                message: "Username already exists" 
            });
        }

        const user = new User({
            username,
            password,
            role: role || "user"
        });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            message: "Server error" 
        });
    }
};

module.exports = {
    login,
    register
};