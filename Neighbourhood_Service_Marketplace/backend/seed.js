const Review = require('./model/review');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./model/user');
const ProviderProfile = require('./model/providerProfile');
const bcrypt = require('bcrypt');

dotenv.config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Clear existing data
        await User.deleteMany({ email: /seed/ });
        await ProviderProfile.deleteMany({});
        await Review.deleteMany({});

        const password = await bcrypt.hash('password123', 10);

        // Create Seed Users
        const users = await User.insertMany([
            { name: 'Rajesh Sharma', email: 'rajesh.seed@example.com', password, role: 'provider' },
            { name: 'Priya Patel', email: 'priya.seed@example.com', password, role: 'provider' },
            { name: 'Amit Singh', email: 'amit.seed@example.com', password, role: 'provider' },
            { name: 'Customer One', email: 'customer1.seed@example.com', password, role: 'user' }
        ]);

        // Create Provider Profiles
        const profiles = await ProviderProfile.insertMany([
            {
                user: users[0]._id,
                category: 'AC Repair',
                bio: 'Expert AC technician with 10 years of experience in repair and installation.',
                hourlyRate: 450,
                location: 'Mumbai, Maharashtra',
                averageRating: 4.8,
                totalReviews: 1
            },
            {
                user: users[1]._id,
                category: 'Home Cleaning',
                bio: 'Professional deep cleaning services for homes and offices.',
                hourlyRate: 300,
                location: 'Delhi, NCR',
                averageRating: 4.9,
                totalReviews: 0
            }
        ]);

        const Service = require('./model/service');


        // Create Services
        await Service.deleteMany({});
        const services = await Service.insertMany([
            {
                title: 'High-Efficiency AC Repair',
                category: 'AC Repair',
                price: 450,
                provider: users[0]._id,
                description: 'Complete maintenance and repair of split and window AC units.',
                location: 'Mumbai, Maharashtra'
            },
            {
                title: 'Deep Home Sanitization',
                category: 'Home Cleaning',
                price: 300,
                provider: users[1]._id,
                description: 'Full house deep cleaning including kitchen and bathrooms.',
                location: 'Delhi, NCR'
            },
            {
                title: 'Full House Sanitization',
                category: 'Home Cleaning',
                price: 250,
                provider: users[1]._id,
                description: 'Eco-friendly house sanitization and cleaning.',
                location: 'Delhi, NCR'
            },
            {
                title: 'Professional Electrician',

                category: 'Electrician',
                price: 500,
                provider: users[2]._id,
                description: 'Certified electrician for all household wiring and appliance repairs.',
                location: 'Bangalore, Karnataka'
            }
        ]);


        console.log('Seeding complete with reviews and services!');

        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
}

seed();
