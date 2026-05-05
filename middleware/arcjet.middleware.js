import aj from '../config/arcjet.js';

const arcjetMiddleware = async(req, res, next) => {
    try {

        // the second parameter is so when user makes a request it takes out 
        // one token from the bucket (for the bucket algorithm used in arcjet)
        const decision = await aj.protect(req, { requested: 1 });

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                return res.status(402).json({ error: "Rate limit exceeded"});
            }
            if(decision.reason.isBot()) {
                return res.status(403).json({error: "Bot detected"});
            }
            return res.status(403).json({error: "Access Denied"});
        }
        next();
    } catch(error) {
        console.log(`Arcject Middleware Error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;
