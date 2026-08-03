const mongoose = require('mongoose');

let cached = global._mongooseConnection;
if (!cached) {
    cached = global._mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
    // If already connected, return immediately
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI environment variable is not set');
        }

        console.log('MongoDB connecting...');
        cached.promise = mongoose.connect(uri, {
            bufferCommands: false,
        }).then((mongooseInstance) => {
            console.log('MongoDB connected');
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null; // Reset so next request retries
        throw err;
    }
    return cached.conn;
};

module.exports = connectDB;
