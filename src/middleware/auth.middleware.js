
import  jwt  from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token topilmadi!" })
    
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Token haqiqiy emas!" });
    }
}