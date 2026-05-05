import mongoose from 'mongoose';

const userSchema = new mongoose.Schema ({

    name: {
        type: String, 
        // if name is not taken as input, it outputs the following message
        required: [true, 'User Name is required'],
        // automatically removes the white space in the front and back
        trim: true,
        min_length: 2,
        max_length: 50,
    },
    email: {
        type: String, 
        required: [true, 'Email is required'], 
        unique: true, 
        trim: true,
        lowercase: true, 
        min_length: 5,
        max_length: 255,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],

    },
    password: {
        type: String, 
        required: [true, 'Password is required'],
        trim: true,
        min_length: 6,

    }
}, { timestamps: true });
// by adding the timestamps: true, allows the user to contain information about 
// when the following data is created/modified

const User = mongoose.model('User', userSchema);

export default User;