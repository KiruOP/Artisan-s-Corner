import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        orderItems: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                title: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                image: { type: String, required: true },
                vendor: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'User',
                    required: true,
                },
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentIntentId: {
            type: String,
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        platformFee: {
            type: Number,
            required: true,
            default: 0.0,
        },
        vendorPayout: [
            {
                vendor: { type: mongoose.Schema.ObjectId, ref: 'User' },
                amount: { type: Number, required: true },
                isPaid: { type: Boolean, default: false },
                paidAt: { type: Date }
            }
        ],
        status: {
            type: String,
            enum: ['processing', 'shipped', 'delivered'],
            default: 'processing',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
