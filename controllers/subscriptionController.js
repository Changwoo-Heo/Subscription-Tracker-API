import Subscription from '../models/subscription.model.js';
import User  from '../models/user.model.js';
import { workflowClient }  from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';

const createSubscription = async(req, res, next) => {
    try {
        const subscription = await Subscription.create({
            // spread the entire request body 
            ... req.body,
            user: req.user._id, // the req user is not part of the body but it
                                // comes from the auth middleware
        })

        // triggering the workflow
        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        })

        res.status(201).json({
            success: "true",
            data: {
                subscription,
                workflowRunId
            }
        });

    } catch(error) {
        next(error);
    }
}


const getSubscription = async(req, res, next) => {
    try {

        if(req.user.id != req.params.id) {
            const error = new Error("You are not the owner of this account");
            error.statusCode = 401;
            throw error;
        }

        let subscriptions = [];

        subscriptions = await Subscription.find({user: req.params.id});

        res.status(200).json({
            success: 'true',
            data: subscriptions
        })

    } catch (error) {
        // forwards it to error handling 
        next(error);
    }
}

const getAllSubscription = async(req, res, next) => {
    try{
        const allSubscriptions = await Subscription.find();

        res.status(200).json({
            success: "true",
            data: allSubscriptions
        });

    } catch(error) {
        next(error);
    }
}

const getAllSubscriptionUser = async(req, res, next) => {
    try{
        if(User.id != req.params.id) {
            const error = new Error('You are not the user of the account!');
            error.statusCode = 401;
            throw error;
        }

        const user = await User.findById(req.params.id);

        if(!user) {
            const error = new Error("User with the following id doesn't exist");
            error.statusCode = 404;
            throw error;
        }

        const allSubscriptions = await Subscription
                                       .find({user: req.params.id});

        res.status(200).json({
            success: "true",
            data: allSubscriptions
        });

    } catch(error) {
        next(error);
    }
}

const deleteAllSubscription = async(req, res, next) => {
    try {
        // req.user.id refers to the user checked through the auth middleware
        if(req.user.id != req.params.id) {
            const error = new Error("You are not the owner of this account");
            error.statusCode = 401;
            throw error;
        }

        await Subscription.deleteMany({
            user: req.params.id
        });

        res.status(200).json({success: 'true'});
    } catch(error) {
        next(error);
    }
}

const deleteSpecificSubscription = async(req, res, next) => {
    try {
        if(req.user.id != req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.statusCode = 401;
            throw error;
        }

        const subscription = await Subscription.findById(req.params.sub_Id);
        if(!subscription) {
            const error = new Error("The following subscription doesn't exist");
            error.statusCode = 403;
            throw error;
        }

        await Subscription.findByIdAndDelete(req.params.sub_Id);

        const updatedSubscription = await Subscription.find({
                                                        user: req.params.id});
        
        res.status(200).json({
            success: 'true',
            data: updatedSubscription
        })

    } catch(error) {
        next(error);
    }
} 

const updateSubscription = async(req, res, next) => {
    try {

        if (req.user.id != req.params.id) {
            const error = new Error("You are not the owner of this account");
            error.statusCode = 401;
            throw error;
        }

        let subscription = await Subscription.findById(req.params.sub_Id);

        if(!subscription) {
            const error = new Error("The following subscription doesn't exist");
            error.statusCode = 403;
            throw error;
        }

        for (const key in req.body) {
            // await subscription.updateOne({
            //     key: req.body[key]
            // })
            subscription[key] = req.body[key];
        }

        console.log(subscription);

        await subscription.save();

        res.status(200).json({
            success: 'true',
            data: subscription
        })

    } catch (error) {
        next(error);
    }
}

const cancelSubscription = async(req, res, next) => {
    try {
        if(req.user.id != req.params.id) {
            const error = new Error("You are not the owner of this account");
            error.statusCode = 401;
            throw error;
        }

        const subscription = await Subscription.findById(req.params.sub_Id);

        if(!subscription) {
            const error = new Error("The following subscrition doesn't exist");
            error.statusCode = 403;
            throw error;
        }

        subscription.status = "cancelled";
        await subscription.save();

        res.status(200).json({
            success: 'true',
            data: subscription
        });

    } catch (error) {
        next(error);
    }
}

const getUpcomingRenewalSubscriptions = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            const error = new Error("The following user doesn't exist");
            error.statusCode = 403;
            throw error;
        }

        if (req.user.id != req.params.id) {
            const error = new Error("You are not the owner of this account");
            error.statusCode = 401;
            throw error;
        }

        // date is modified/handled in milliseconds
        const in14Days = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        const subscriptions = await Subscription.find({
            renewal_date: {
                $gt: new Date(),
                $lt: in14Days
            }
        });

        res.status(200).json({
            success: 'true',
            data: subscriptions
        })

    } catch (error) {
        next(error);
    }
}

export { createSubscription, 
         getSubscription, 
         getAllSubscription,
         getAllSubscriptionUser, 
         deleteAllSubscription, 
         deleteSpecificSubscription, 
         updateSubscription, 
         cancelSubscription, 
         getUpcomingRenewalSubscriptions};