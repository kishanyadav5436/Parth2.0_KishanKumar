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

        // Create Reviews
        await Review.create({
            customer: users[3]._id,
            provider: users[0]._id, // Points to the User ID of the provider
            rating: 5,
            comment: 'Rajesh was amazing! He fixed my AC in no time and was very professional.'
        });

        console.log('Seeding complete with reviews!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
}

seed();
