import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

// someone is making a request get user details => authorize middleware => 
// verify => if valid => next

const authorize = async(req, res, next) => {
    try {
        // check whether the token of the current user and the user trying to 
        // be found is the same
        let token;

        if(req.headers.authorization && 
           req.headers.authorization.startsWith('Bearer')) {
            
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            console.log("TOKEN DOESN'T EXIST");
            return res.status(401).json({message:'Unauthorized'});
        }

        // checks if the token is valid, if so, it returns the payload inside 
        // the token 
        const decoded = jwt.verify(token, JWT_SECRET);

        // console.log("decoded done " + decoded.userId);
        
        const user = await User.findById(decoded.userId);

        if(!user) {
            return res.status(401).json({message:'User does not exist'});
        }

        req.user = user;

        // so it leaves the middlewear and moves on to the logic and handle 
        // the request made
        next();
    } catch(error) {
        res.status(401).json({message: "unauthorized", error: error.message});
    }
};

export default authorize;