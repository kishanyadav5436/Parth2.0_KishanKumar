const express = require('express');
const router = express.Router();
const Review = require('../model/review');
const ProviderProfile = require('../model/providerProfile');
const { verifyToken } = require('../middleware/auth');

// Create a review
router.post('/', verifyToken, async (req, res) => {
    try {
        const { providerId, bookingId, rating, comment } = req.body;

        // Create review
        const review = new Review({
            customer: req.user.id,
            provider: providerId,
            booking: bookingId,
            rating,
            comment
        });

        await review.save();

        // Update provider profile average rating
        const allReviews = await Review.find({ provider: providerId });
        const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const averageRating = totalRating / allReviews.length;

        await ProviderProfile.findOneAndUpdate(
            { user: providerId },
            { 
                averageRating: averageRating.toFixed(1),
                totalReviews: allReviews.length
            }
        );

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get reviews for a provider
router.get('/provider/:providerId', async (req, res) => {
    try {
        const reviews = await Review.find({ provider: req.params.providerId })
            .populate('customer', 'name')
            .sort({ createdAt: -1 });
            
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
