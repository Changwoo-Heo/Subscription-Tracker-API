import { Router } from 'express';
import { signUp, signIn, signOut } from '../controllers/authController.js'

const authRouter = Router();

// authRouter.get('/signup', (req, res) => {
//     res.json({message: "signup"});
// });

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', signOut);

export default authRouter;