import jwt from 'jsonwebtoken'
import User from "../models/user.js";
import bcrypt from 'bcryptjs'
import Chat from '../models/chat.js';

// Generate jwt token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRETE, {
        expiresIn: '15d'
    })
}

// API for user registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userExist = await User.findOne({ email })

        if (userExist) {
            return res.json({ success: false, message: "User Already Exists" })
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to Login user 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                const token = generateToken(user._id)
                res.json({ success: true, token })
            }
        }

        return res.json({ success: false, message: 'Invalid email or password' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get userdata
export const getUser = async (req, res) => {
    try {
        const user = req.user
        return res.json({ success: true, user })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get Published images
export const getPublishedImages = async (req, res) => {
    try {
        const publishedImageMassegase = await Chat.aggregate([
            { $unwind: "$messages" },
            {
                $match: {
                    "messeges.isImage": true,
                    "messeges.isPublished": true
                }
            },
            {
                $project: {
                    _id: 0,
                    imageUrl: "$messages.content",
                    userName: '$userName'
                }
            }
        ])

        res.json({ success: true, images: publishedImageMassegase.reverse() })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}