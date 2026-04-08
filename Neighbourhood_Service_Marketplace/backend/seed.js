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
            { name: 'Suresh Kumar', email: 'suresh.seed@example.com', password, role: 'provider' },
            { name: 'Ravi Verma', email: 'ravi.seed@example.com', password, role: 'provider' },
            { name: 'Anita Desai', email: 'anita.seed@example.com', password, role: 'provider' },
            { name: 'Customer One', email: 'customer1.seed@example.com', password, role: 'user' }
        ]);

        // Create Provider Profiles
        const profiles = await ProviderProfile.insertMany([
            {
                user: users[0]._id,
                category: 'AC Repair',
                bio: 'Expert AC technician with 10 years of experience in repair and installation. Quick response guaranteed.',
                hourlyRate: 450,
                location: 'Mumbai, Maharashtra',
                averageRating: 4.8,
                totalReviews: 14
            },
            {
                user: users[1]._id,
                category: 'Home Cleaning',
                bio: 'Professional deep cleaning services for homes and offices. 24/7 support available.',
                hourlyRate: 300,
                location: 'Delhi, NCR',
                averageRating: 4.9,
                totalReviews: 21
            },
            {
                user: users[2]._id,
                category: 'Electrician',
                bio: 'Certified electrician for all commercial and residential works. Fast and reliable service.',
                hourlyRate: 500,
                location: 'Bangalore, Karnataka',
                averageRating: 4.7,
                totalReviews: 8
            },
            {
                user: users[3]._id,
                category: 'Plumbing',
                bio: 'Expert plumber handling pipe bursts, installations, and repairs with a quick response time.',
                hourlyRate: 400,
                location: 'Hyderabad, Telangana',
                averageRating: 4.6,
                totalReviews: 12
            },
            {
                user: users[4]._id,
                category: 'Painting',
                bio: 'Premium interior and exterior house painting services. High-quality paints used.',
                hourlyRate: 800,
                location: 'Pune, Maharashtra',
                averageRating: 4.9,
                totalReviews: 34
            },
            {
                user: users[5]._id,
                category: 'Gardening',
                bio: 'Professional landscaping and gardening services for an aesthetic outdoor space.',
                hourlyRate: 350,
                location: 'Chennai, Tamil Nadu',
                averageRating: 4.5,
                totalReviews: 5
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
                description: 'Complete maintenance and repair of split and window AC units. Quick response service.',
                location: 'Mumbai, Maharashtra'
            },
            {
                title: 'Deep Home Sanitization',
                category: 'Home Cleaning',
                price: 300,
                provider: users[1]._id,
                description: 'Full house deep cleaning including kitchen and bathrooms. 24/7 support.',
                location: 'Delhi, NCR'
            },
            {
                title: 'Professional Electrician',
                category: 'Electrician',
                price: 500,
                provider: users[2]._id,
                description: 'Certified electrician for all household wiring and appliance repairs.',
                location: 'Bangalore, Karnataka'
            },
            {
                title: 'Emergency Plumbing Services',
                category: 'Plumbing',
                price: 400,
                provider: users[3]._id,
                description: 'Fixing leaks, blockages, and installing new fittings. Quick response guaranteed.',
                location: 'Hyderabad, Telangana'
            },
            {
                title: 'Interior House Painting',
                category: 'Painting',
                price: 800,
                provider: users[4]._id,
                description: 'Top-tier painting services with waterproofing features.',
                location: 'Pune, Maharashtra'
            },
            {
                title: 'Landscaping & Gardening Design',
                category: 'Gardening',
                price: 350,
                provider: users[5]._id,
                description: 'Complete yard overhaul and regular garden maintenance.',
                location: 'Chennai, Tamil Nadu'
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
