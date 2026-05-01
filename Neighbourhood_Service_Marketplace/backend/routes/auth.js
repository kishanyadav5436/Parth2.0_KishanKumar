const express =require('express');
const router=express.Router();
const User =require('../model/user');
const bcrypt =require('bcrypt');
const jwt =require('jsonwebtoken');
const ProviderProfile = require('../model/providerProfile');
const Service = require('../model/service');

router.post('/register',async(req,res)=>{
    try{
        const {name, email, password, role, category} = req.body;
        
        // Validation
        if(!name || name.trim() === '') return res.status(400).json({message: 'Name is required'});
        if(!email || !email.includes('@')) return res.status(400).json({message: 'Invalid email'});
        if(!password || password.length < 6) return res.status(400).json({message: 'Password must be at least 6 characters'});
        
        if (role === 'provider' && (!category || category.trim() === '')) {
            return res.status(400).json({message: 'Service category is required for providers'});
        }

        const hashPassword = await bcrypt.hash(password,10);
        const user = new User({name,email,password:hashPassword,role});
        await user.save();

        if (role === 'provider') {
            const providerProfile = new ProviderProfile({
                user: user._id,
                category
            });
            await providerProfile.save();

            // Also create a default service for this provider so they show up in listings
            const defaultService = new Service({
                title: `${category} Service`,
                category,
                price: 500, // Default price
                provider: user._id,
                description: `Professional ${category} services in your neighbourhood.`,
                location: 'Mumbai, Maharashtra'
            });
            await defaultService.save();
        }
        
        const token = jwt.sign({id:user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn:'1h'});
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', token, { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', maxAge: 3600000 });
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
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', token, { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', maxAge: 3600000 });
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
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax' });
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;