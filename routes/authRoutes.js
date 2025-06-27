const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
const bcrypt=require('bcryptjs');
const User=require('../models/user');
require('dotenv').config();
const verifyToken = require('../middleware/authMiddleware');
router.post('/register',async (req,res)=>{
    try{
        const {name,email,password}=req.body;
    const userExists=await User.findOne({email});
    if(userExists) return  res.status(400).json({error:'email already exists'});

    const salt=await bcrypt.genSalt(10);
    const hashedOne=await bcrypt.hash(password,salt);
    const user=await User.create({name,email,password:hashedOne});

        const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email
        };

    res.status(201).json(userResponse);
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
})

router.post('/login',async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({error:'invalid login credentials'
        });
        const check=await bcrypt.compare(password,user.password);
        if (!check) return res.status(404).json({error:'invalid login credentials'});

        const payload = {
         userId: user._id
                      };
        const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
        res.json({token});



    }
    catch(err){
res.status(500).json({ error: err.message });
    }
});
router.get('/me', verifyToken, (req, res) => {
  res.json(req.user);
});
module.exports=router;