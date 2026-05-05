// since express is a default function from express, no need to surround it 
// with curly braces
import express from 'express';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './Database/monogodb.js';
import errorMiddleware from './middleware/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middleware/arcjet.middleware.js';
import workFlowRouter from './routes/workflow.routes.js';


const app = express();

// built middleware that allows your app to handle JSON data sent in requests or
// API calls
app.use(express.json());

// helps us processs the form data sent via HTML forms in a simple format
app.use(express.urlencoded({ extended: false}));

// reads cookies from incoming request so it can store datas of your users
app.use(cookieParser());

// app.use(arcjetMiddleware);

// adding base URLS in front of the site depending on the diff routes users 
// want to use
app.use('/api/v1/auths', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workFlowRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.json({message: 'Welcome to the Subscription Tracker API!'});
});

// if(process.env.NODE_ENV !== 'production') {
//     const server = app.listen(PORT, async () => {
//         console
//         .log(`Subcription Tracker API is running on http://localhost:${PORT}`);

//         await connectToDatabase();
//     });
// } else {
//     try {
//         console.log("DB URI Exists: ", !!process.env.DB_URI);
//         await connectToDatabase();
//     } catch(error) {
//         throw error;
//     }
// }

export default app;