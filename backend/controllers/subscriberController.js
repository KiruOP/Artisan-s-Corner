import Subscriber from '../models/Subscriber.js';

// @desc    Subscribe to newsletter
// @route   POST /api/subscribers
// @access  Public
export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide an email address' });
        }

        const subscriberExists = await Subscriber.findOne({ email });

        if (subscriberExists) {
            return res.status(400).json({ message: 'Email is already subscribed' });
        }

        const subscriber = await Subscriber.create({ email });

        res.status(201).json({
            success: true,
            data: subscriber,
            message: 'Successfully subscribed to the newsletter!'
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email is already subscribed' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};
