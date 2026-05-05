// allows to import the upstash workflow
import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js'

const REMINDERS = [7, 5, 2, 1];

// the function type serve comes from upstash workflow express
const sendReminders = serve(async (context) => {
    // When workflow is triggered, it will pass the ID of the subscription
    const { subscriptionId } = context.requestPayload;
    // Fetching details about the subscription
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status != 'active') {
        return;
    }

    const renewalDate = dayjs(subscription.renewal_date);

    // dayjs() returns the current date and time
    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.'`);
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        // Ex: if renewal date = 22 Feb, reminder date = 15, 17, 20, 21 of Feb
        
        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        if (dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);

        }
    }
})

const fetchSubscription = async(context, subscriptionId) => {
    // Starting the conetext
    return await context.run('get subscription', async () => {
        // Returns the subscription detail with the user name and email
        return Subscription
               .findById(subscriptionId)
               .populate('user', 'name email');
    })
};

const sleepUntilReminder = async(context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);
        // send email, SMS, push notification ...
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription
        });
    })
}


export { sendReminders };