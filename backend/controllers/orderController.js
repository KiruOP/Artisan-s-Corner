import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order & payment intent
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethodId, // Added for direct Stripe processing if needed from frontend
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            // Calculate prices and commissions
            let totalAmount = 0;
            let platformFee = 0;
            let vendorPayout = 0;

            // Group items by vendor (simplification: assuming 1 vendor per order for payout logic,
            // or we just calculate total splits for the order object).
            // Here we calculate total amount based on the prices passed from frontend (better to fetch from DB in prod)
            for (const item of orderItems) {
                totalAmount += item.price * item.quantity;
            }

            // 5% Commission Logic
            platformFee = Number((totalAmount * 0.05).toFixed(2));
            vendorPayout = Number((totalAmount - platformFee).toFixed(2));

            // Create Payment Intent with Stripe (if not already done on frontend)
            let paymentIntent;
            if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'add_your_stripe_secret_key') {
                paymentIntent = await stripe.paymentIntents.create({
                    amount: Math.round(totalAmount * 100), // Stripe uses cents
                    currency: 'usd',
                    payment_method: paymentMethodId || 'pm_card_visa', // Mock/Demo unless actual ID passed
                    confirm: true,
                    automatic_payment_methods: {
                        enabled: true,
                        allow_redirects: 'never'
                    }
                });
            }

            const order = new Order({
                buyer: req.user._id,
                orderItems,
                shippingAddress,
                totalAmount,
                platformFee,
                vendorPayout,
                paymentIntentId: paymentIntent ? paymentIntent.id : 'demo_payment_intent',
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('buyer', 'name email')
            .populate('orderItems.vendor', 'name email storeProfile.storeName');

        if (order) {
            if (order.buyer._id.toString() !== req.user._id.toString() && !req.user.roles.includes('admin') && !req.user.roles.includes('vendor')) {
                return res.status(401).json({ message: 'Not authorized to view this order' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get vendor orders
// @route   GET /api/orders/vendor
// @access  Private/Vendor
export const getVendorOrders = async (req, res) => {
    try {
        // Find all orders where at least one item belongs to this vendor
        const orders = await Order.find({
            'orderItems.vendor': req.user._id
        }).populate('buyer', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Vendor
export const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            // Check if vendor has items in this order
            const isVendorOwnsItem = order.orderItems.some(
                (item) => item.vendor.toString() === req.user._id.toString()
            );

            if (!isVendorOwnsItem && !req.user.roles.includes('admin')) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            order.status = 'delivered';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
