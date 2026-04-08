const express = require('express');
const router = express.Router();
const Booking = require('../model/booking');
const ProviderProfile = require('../model/providerProfile');
const { verifyToken } = require('../middleware/auth');

// Create a new booking — requires auth cookie
router.post('/', verifyToken, async (req, res) => {
    try {
        const { serviceId, date, timeSlot, description, phone, address, paymentMethod } = req.body;

        if (!serviceId) return res.status(400).json({ message: 'Service ID is required' });
        if (!date) return res.status(400).json({ message: 'Date is required' });

        const Service = require('../model/service');
        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ message: 'Service not found' });

        const newBooking = new Booking({
            customer: req.user.id,
            provider: service.provider,
            service: serviceId,
            date: new Date(date),
            timeSlot: timeSlot || '',
            description: description || '',
            phone: phone || '',
            address: address || '',
            paymentMethod: paymentMethod || 'cash'
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });

    } catch (err) {
        console.error('Booking Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get user's bookings (either as customer or provider)
router.get('/', verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({
            $or: [
                { customer: req.user.id },
                { provider: req.user.id }
            ]
        })
        .populate('customer', 'name email')
        .populate('provider', 'name email')
        .populate('service')

        .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get a single booking
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('customer', 'name email')
            .populate('provider', 'name email');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update booking status (accept/reject/complete)
router.patch('/:id/status', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'accepted', 'completed', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const isProvider = booking.provider.toString() === req.user.id.toString();
        const isCustomer = booking.customer.toString() === req.user.id.toString();

        if (isProvider) {
            booking.status = status;
        } else if (isCustomer && status === 'rejected') {
            booking.status = 'rejected'; // Customer can cancel
        } else {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        await booking.save();
        res.json({ message: 'Booking status updated', booking });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
