import { Router } from 'express';
import { sendReminders } from "../controllers/workflowControllers.js";

const workFlowRouter = new Router();

workFlowRouter.post('/subscription/reminder', sendReminders);

export default workFlowRouter;