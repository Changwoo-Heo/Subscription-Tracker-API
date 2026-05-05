// the information that happended before the request and the one after
const errorMiddleware = (err, req, res, next) => {
    try {
        // Copies all enumerable properties from err into a new object
        let error = { ...err };

        error.message = err.message;

        console.error(err);

        // Mongoose bad ObjectId
        if (err.name == 'CastError') {
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose duplicate key
        if (err.code == 11000) {
            const message = 'Duplicate key found';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose validation error
        if (err.name  == 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }

        return res
               .status(error.statusCode || 500)
               .json({success: false, error: error.message || 'Server Error'});

    } catch(error) {
        next(error);
    }
};


export default errorMiddleware;

// create a subscription => middleware (check for renewal date) => 
// middleware (check for errors) => goes to controller and handle the logic to 
// create a subscription