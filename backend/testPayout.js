import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected for test');

        // Clean up
        await User.deleteMany({ email: /test.*@example\.com/ });
        await Product.deleteMany({ title: 'Test Vase' });

        // Create Admin
        const admin = await User.create({
            name: 'Test Admin',
            email: 'test_admin@example.com',
            password: 'password123',
            roles: ['buyer', 'admin']
        });

        // Create Vendor
        const vendor = await User.create({
            name: 'Test Vendor',
            email: 'test_vendor@example.com',
            password: 'password123',
            roles: ['buyer', 'vendor'],
            storeProfile: { storeName: 'Test Store' }
        });

        // Create Buyer
        const buyer = await User.create({
            name: 'Test Buyer',
            email: 'test_buyer@example.com',
            password: 'password123',
            roles: ['buyer']
        });

        // Create Product
        const product = await Product.create({
            title: 'Test Vase',
            description: 'Test description',
            price: 100,
            images: ['https://placehold.co/100'],
            category: 'Home',
            stock: 10,
            vendor: vendor._id
        });

        // Call POST /api/orders
        const fetch = globalThis.fetch;

        // Login as buyer
        const buyerRes = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test_buyer@example.com', password: 'password123' })
        });
        const buyerData = await buyerRes.json();
        const buyerToken = buyerData.token;

        // Place Order
        const orderItems = [{
            product: product._id,
            title: product.title,
            price: product.price,
            quantity: 2,
            image: product.images[0],
            vendor: vendor._id
        }];

        const orderRes = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${buyerToken}`
            },
            body: JSON.stringify({
                orderItems,
                shippingAddress: { address: '123 Test', city: 'Test City', postalCode: '12345', country: 'Test' }
            })
        });
        const orderData = await orderRes.json();

        const orderId = orderData._id;
        console.log(`Order Created: ${orderId}`);
        console.log('Vendor Payout initially:', orderData.vendorPayout);

        // Login as admin
        const adminRes = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test_admin@example.com', password: 'password123' })
        });
        const adminData = await adminRes.json();
        const adminToken = adminData.token;

        console.log(`Simulating Payout...`);
        // Hit new endpoint
        const payoutRes = await fetch(`http://localhost:5000/api/orders/${orderId}/payout`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`
            },
            body: JSON.stringify({ vendorId: vendor._id })
        });
        const payoutData = await payoutRes.json();

        console.log('Vendor Payout after update:', payoutData.vendorPayout);

        if (payoutData.vendorPayout[0].isPaid === true) {
            console.log('✅ TEST PASSED: Vendor payout was successfully recorded!');
        } else {
            console.log('❌ TEST FAILED: Vendor payout isPaid should be true');
        }

        process.exit(0);
    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
};

runTest();
