import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

if (!DB_URI) {
    const error = new Error('Please define the MONGODB_URI');
    error.statusCode = 404;
    throw error;
    // throw new Error('Please define the MONGODB_URI environment variable inside .env<development/productino>.local');
    // return res.status(400).json()
}

const connectToDatabase = async() => {
    try {
        console.log('Tyring to connect to mongoDB');
        await mongoose.connect(DB_URI);

        console.log(`Connected to database in ${NODE_ENV} mode`)
    } catch (error) {
        console.log("Error connecting to database: ", error);

        process.exit(1);
    }
} 

// export default usually used for a file with one main thing/function
export default connectToDatabase;