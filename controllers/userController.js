import User from "../models/user.model.js";

const fetchAllUsers = async(req, res, next) => {
    try {
        // finds all user while getting every attribute except the password
        const users = await User.find().select('-password');
        
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch(error) {
        // forwards it to the our error handling
        next(error);
    }
}

const fetchUser = async(req, res, next) => {
    try {
        // finds the user with the specific id and get all their information 
        // except for the password
        // req.params.id can be used as in the routes, we tell the server that
        // whatever comes after /fetch-user/ to be id 

        const user = await User
                           .findById(req.params.id).select('-password');

        if(!user) {
            const error = new Error("User with the following id doesn't exist");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch(error) {
        // forwards it to the our error handling
        next(error);
    }
}

export { fetchAllUsers, fetchUser };