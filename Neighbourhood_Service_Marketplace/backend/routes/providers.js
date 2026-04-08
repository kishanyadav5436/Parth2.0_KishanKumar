const express = require('express');
const router = express.Router();
const ProviderProfile = require('../model/providerProfile');
const { verifyToken, isProvider } = require('../middleware/auth');

// Get all providers (optional filter by category)
router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }
        const profiles = await ProviderProfile.find(query).populate('user', 'name email');
        res.json(profiles);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get a specific provider by profile ID
router.get('/:id', async (req, res) => {
    try {
        const profile = await ProviderProfile.findById(req.params.id).populate('user', 'name email');
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Create or update provider profile (Protected, Provider Only)
router.post('/profile', verifyToken, isProvider, async (req, res) => {
    try {
        const { category, bio, hourlyRate, location } = req.body;
        let profile = await ProviderProfile.findOne({ user: req.user.id });

        if (profile) {
            // Update
            profile.category = category || profile.category;
            profile.bio = bio || profile.bio;
            profile.hourlyRate = hourlyRate || profile.hourlyRate;
            profile.location = location || profile.location;
            await profile.save();
            return res.json({ message: 'Profile updated successfully', profile });
        }

        // Create new
        profile = new ProviderProfile({
            user: req.user.id,
            category,
            bio,
            hourlyRate,
            location
        });
        await profile.save();
        res.status(201).json({ message: 'Profile created successfully', profile });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
