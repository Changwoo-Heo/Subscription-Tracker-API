import mongoose from 'mongoose';
import User from './user.model.js';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Subscription name is required'], 
        trim: true, 
        minlength: 2,
        maxlength: 100,
    }, 
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be greater than 0"],
    },
    currency: {
        type: String, 
        enum: ['USD', 'WON'],
        default: 'USD',
        trim: true,
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        trim: true,
    },
    category: {
        type: String,
        enum: ['sports', 'entertainment', 'music', 'news', 'technology'],
        required: [true, 'Category is required'],
        trim: true,
    },
    pay_method: {
        type: String, 
        required:[true, 'Pay_method is required'],
        trim: true,
    }, 
    status: {
        type: String, 
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    start_date: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            // makes sure the start date is in the past from today
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past',
        }
    },
    renewal_date: {
        type: Date,
        // makes sure the renewal date is after the start date
        validate: {
            validator: (value) => value >= new Date(),
            message: 'Renewal date must be after the start date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        index: true,
    },
}, { timestamps: true });

// Auto Calculate the renewal has passed
// Called before a document is saved
subscriptionSchema.pre('save', function (next) {
    if(!this.renewal_date) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7, 
            monthly: 30,
            yearly: 365,
        };

        this.renewal_date = new Date(this.start_date);
        this.renewal_date
        .setDate(this.renewal_date.getDate() + renewalPeriods[this.frequency]);
    }

    // Auto-update the status if renewal date has passed
    if(new Date() > this.renewal_date) {
        this.status = 'expired';
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
