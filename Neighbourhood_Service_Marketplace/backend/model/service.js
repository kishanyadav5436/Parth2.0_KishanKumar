const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1581578731548-c64695ce6952?auto=format&fit=crop&q=80&w=400'
    },
    location: {
        type: String,
        default: 'Mumbai, Maharashtra'
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
