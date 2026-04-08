const express = require('express');
const router = express.Router();
const Service = require('../model/service');
const { verifyToken, isProvider } = require('../middleware/auth');

// Get all services (with optional filters)
router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.category) query.category = req.query.category;
        if (req.query.provider) query.provider = req.query.provider;
        
        const services = await Service.find(query).populate('provider', 'name email');
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


// Get service by ID
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('provider', 'name email');
        if (!service) return res.status(404).json({ message: 'Service not found' });
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Create a new service (Provider only)
router.post('/', verifyToken, isProvider, async (req, res) => {
    try {
        const { title, category, price, description, location, image } = req.body;
        
        const newService = new Service({
            title,
            category,
            price,
            description,
            location,
            image,
            provider: req.user.id
        });
        
        await newService.save();
        res.status(201).json(newService);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update a service (Provider only)
router.put('/:id', verifyToken, isProvider, async (req, res) => {
    try {
        let service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });
        
        // Check if provider owns the service
        if (service.provider.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        
        service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
