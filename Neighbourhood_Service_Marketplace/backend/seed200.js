const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const User = require('./model/user');
const ProviderProfile = require('./model/providerProfile');
const Service = require('./model/service');

dotenv.config();

const indianCities = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi', state: 'NCR' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Lucknow', state: 'Uttar Pradesh' }
];

const professions = [
  'AC Repair', 'Plumbing', 'Electrician', 'Home Cleaning', 
  'Painting', 'Carpenter', 'Pest Control', 'Appliance Repair',
  'Gardening', 'Packers & Movers', 'Personal Fitness Trainer', 'Home Salon'
];

async function seedMassive() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Wipe previous mock data to prevent bloated db
    console.log('Clearing old mocked data...');
    await User.deleteMany({ email: /mock|seed/ });
    await ProviderProfile.deleteMany({});
    await Service.deleteMany({});
    
    // We will keep your hardcoded Customer One seed logic intact 
    const password = await bcrypt.hash('password123', 10);
    await User.create({ name: 'Customer One', email: 'customer1.seed@example.com', password, role: 'user' })

    const totalProviders = 200;
    console.log(`Generating ${totalProviders} providers...`);
    
    // Generate 200 mock providers
    for (let i = 0; i < totalProviders; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.mock${i}@example.com`;
        
        // 1. Create User
        const user = await User.create({
            name: `${firstName} ${lastName}`,
            email: email,
            password: password,
            role: 'provider'
        });

        const category = faker.helpers.arrayElement(professions);
        const cityObj = faker.helpers.arrayElement(indianCities);
        const locationText = `${cityObj.city}, ${cityObj.state}`;

        // 2. Create Profile
        const profile = await ProviderProfile.create({
            user: user._id,
            category: category,
            bio: `${faker.person.jobDescriptor()} ${category} professional offering quick and trusted services. ${faker.lorem.sentences(2)}`,
            hourlyRate: faker.number.int({ min: 150, max: 1500 }),
            location: locationText,
            averageRating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
            totalReviews: faker.number.int({ min: 5, max: 250 })
        });

        // 3. Create Corresponding Service Listing
        await Service.create({
            title: `${faker.commerce.productAdjective()} ${category}`,
            category: category,
            price: profile.hourlyRate,
            provider: user._id,
            description: `We offer premium ${category} services in ${cityObj.city}. Contact us for 24/7 fast repairs and services!`,
            location: locationText
        });

        if (i % 50 === 0 && i !== 0) {
            console.log(`... ${i} generated so far`);
        }
    }

    console.log(`✓ Successfully seeded ${totalProviders} providers and services across all Indian locations!`);
    process.exit(0);

  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
}

seedMassive();
