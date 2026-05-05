import { Router } from 'express';
import { fetchAllUsers, fetchUser } from '../controllers/userController.js';
import authorize from '../middleware/auth.middleware.js';

const userRouter = Router();

userRouter.get('/', fetchAllUsers);
userRouter.get('/:id', authorize, fetchUser);


export default userRouter;