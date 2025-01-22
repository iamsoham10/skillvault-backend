const jwt = require('jsonwebtoken');
require('dotenv').config();

const tokenValidator = async (req, res, next) => {
    const token = req.header("Authorization");
    if(!token || !token.startsWith("Bearer ")){
        return res.status(401).json({success: false, error: "Unauthorized access. No token provided"});
    }
    const tokenValue = token.split(" ")[1];
    try {
        const decoded = jwt.verify(tokenValue, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch(err){
        res.status(401).json({ error: "Invalid token" });
    }
}

module.exports = tokenValidator;