import jwt from 'jsonwebtoken'
import User from '../models/user.js';

export const protect = async (req,res,next) => {
    let token = req.headers.authorization;
    try {
        const decode = jwt.verify(token,process.env.JWT_SECRETE)
        const userId =decode.id
        const user = await User.findById(userId)

        if (!user) {
            return res.json({success:false,message:"Not Authorized, user not found"})
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({message:"Not Authorized, token failed"})
    }
}