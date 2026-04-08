const express =require('express');
const router=express.Router();
const User =require('../model/user');
const bcrypt =require('bcrypt');
const jwt =require('jsonwebtoken');

router.post('/register',async(req,res)=>{
    try{
        const {name, email, password, role} = req.body;
        
        // Validation
        if(!name || name.trim() === '') return res.status(400).json({message: 'Name is required'});
        if(!email || !email.includes('@')) return res.status(400).json({message: 'Invalid email'});
        if(!password || password.length < 6) return res.status(400).json({message: 'Password must be at least 6 characters'});

        const hashPassword = await bcrypt.hash(password,10);
        const user = new User({name,email,password:hashPassword,role});
        await user.save();
        
        const token = jwt.sign({id:user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn:'1h'});
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });
        res.status(201).json({message:'User registered successfully', user});
    }catch(err){
        console.error('Registration Error:', err);
        res.status(500).json({message:'Server error', error: err.message});
    }
});

router.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user =await User.findOne({email});
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:'Invalid credentials'});
        }
        const token = jwt.sign({id:user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn:'1h'});
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });
        res.json({message: 'Logged in successfully', user});
    } catch(err) {
        res.status(500).json({message:'Server error'});
    }
});

router.get('/me', async(req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({message: 'Not authenticated'});
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id).select('-password');
        res.json({user});
    } catch(err) {
        res.status(401).json({message: 'Invalid token'});
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: false });
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;