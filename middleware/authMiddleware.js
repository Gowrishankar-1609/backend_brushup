const jwt=require('jsonwebtoken');
const User=require('../models/user');


const verifyToken= async (req,res,next)=>{
    const authHeader=req.headers.authorization;

    if (!authHeader ||!authHeader.startsWith('Bearer')){
        res.status(401).json({error:"No token authorization denied"});
    }
    const token =authHeader.split(' ')[1];

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findById(decoded.userId).select('-password');
        next();
}
catch(err){
    res.status(401).json({ error: 'Invalid token' });
}
}
module.exports=verifyToken;