import jwt from 'jsonwebtoken'
import User from '../models/user.js';

export const protect = async (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Not Authorized, no token provided" })
    }

    const token = authHeader.split(' ')[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRETE)
        const userId = decode.id
        const user = await User.findById(userId).select('-password')

        if (!user) {
            return res.status(401).json({ success: false, message: "Not Authorized, user not found" })
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Not Authorized, token failed" })
    }
}