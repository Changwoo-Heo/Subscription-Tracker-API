import { emailTemplates } from "./email-template.js";
import dayjs from 'dayjs';
import { EMAIL_PASSWORD } from "../config/env.js";
import { accountEmail, transporter } from '../config/nodemailer.js';

export const sendReminderEmail = async ({ to, type, subscription}) => {
    if(!to || !type) {
        throw new Error('Missing required parameters');
    }

    // looks into the type based on the t.label, it will compare to the type we 
    // have and use the template that matches the type
    const template = emailTemplates.find((t) => t.label === type);

    if(!template) {
        throw new Error('Invalid email type');
    }

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewal_date).format('MMM D, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.pay_method,
    }

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: subject, 
        html: message,
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.log(error, 'Error sending email');
        throw error; // optional but recommended
    }
}