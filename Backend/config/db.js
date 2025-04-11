const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDB connected')
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`)
        process.exit(1) // Exit application if connection fails
    }
}

module.exports = connectDb;