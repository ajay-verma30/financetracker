const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_TOKEN;

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"Unauthorized Access: No token provided"});
    }
    jwt.verify(token, JWT_SECRET, (err, user)=>{
        if(err){
            return res.status(403).json({message:"Forbidden: Invalid Token"});
        }
        req.user= user;
        next();
    });
}

module.exports = authenticateToken;