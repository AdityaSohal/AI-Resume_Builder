import jwt from 'jsonwebtoken'

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: 'unauthorized'})
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userID = decoded.userID;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized'})
    }
}
export default protect;