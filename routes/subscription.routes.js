import { Router } from 'express';
import { createSubscription, 
         getSubscription, 
         getAllSubscription,
         getAllSubscriptionUser,
         deleteAllSubscription,
         deleteSpecificSubscription,
         updateSubscription,
         cancelSubscription,
         getUpcomingRenewalSubscriptions } 
         from '../controllers/subscriptionController.js';

import authorize from '../middleware/auth.middleware.js';

const subscriptionRouter = Router();
 
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.get('/user/:id', authorize, getSubscription);
subscriptionRouter.get('/', getAllSubscription);
subscriptionRouter.get('/:id', getAllSubscriptionUser);
subscriptionRouter.delete('/delete-all/:id', authorize, deleteAllSubscription);
subscriptionRouter.delete('/delete/:id/:sub_Id', authorize, 
                           deleteSpecificSubscription);
subscriptionRouter.put('/update/:id/:sub_Id', authorize, updateSubscription);
subscriptionRouter.put('/cancel/:id/:sub_Id', authorize, cancelSubscription);
subscriptionRouter.get('/upcoming-renewal/:id', authorize, 
                        getUpcomingRenewalSubscriptions);
export default subscriptionRouter;

// routers and controllers to create:
// get subscription details
// cancel subscription
// get upcoming renewals