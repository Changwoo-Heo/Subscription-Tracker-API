import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

export const signUp = async(req, res, next) => {

    const session = await mongoose.startSession();

    // used to perform atomic update, a.k.a atmoic operations
    // Database operations have to be atomic, meaning they either have to do ALL
    // or nothing
    // Ex: Insert either works completely or it doesn't
    // never get half an operation
    session.startTransaction();

    try {
        
        const { name, email, password } = req.body;

        // User refers to the User model created for mongoose
        
        const userExists = await User.findOne( {email: email} );

        if(userExists) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Session is attached at the end so when something goes wrong and it 
        // aborts, the user is not created
        const newUsers = await User
                              .create([{name, email, password: hashedPassword,}], { session });
        
        // Generate Jwt Token
        // Payload = information put inside the token
        const payload = { userId: newUsers[0]._id };
        const jwt_Token = jwt
                          .sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN});
        
        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                jwt_Token, 
                User: newUsers[0],
            }
        });
    } catch(error) {
        await session.abortTransaction();
        next(error);
    } finally {
        await session.endSession();
    }

};

// No need for a mongoose session here as there are no overwriting of the 
// database
export const signIn= async(req, res, next) => {
    
    try {
        const { email, password } = req.body;

        const userExists = await User.findOne( {email: email});

        if (!userExists) {
            const error = new Error("User with the email doesn't exist");
            error.codeStatus = 404;
            throw error;
        }

        const validatePassword = await bcrypt
                                       .compare(password, userExists.password);

        if (!validatePassword) {
            const error = new Error('Wrong password, try again');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt
                      .sign( {userId: userExists._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN})

        res.status(201).json({
            success: "true",
            message: "user singed in successfully",
            data: {
                token,
                userExists,
            }
        });

    } catch(error) {
        next(error);
    }

};
export const signOut= async(req, res, next) => {};
