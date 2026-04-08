const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ProviderProfile = require('./model/providerProfile');
const User = require('./model/user');

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        const count = await ProviderProfile.countDocuments();
        console.log('Provider count:', count);
        const providers = await ProviderProfile.find().populate('user');
        console.log('Providers:', JSON.stringify(providers, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

check();
