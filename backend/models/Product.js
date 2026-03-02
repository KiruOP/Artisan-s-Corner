import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a product title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a product description'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            min: 0,
        },
        images: {
            type: [String],
            required: [true, 'Please add at least one image'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        stock: {
            type: Number,
            required: [true, 'Please add stock quantity'],
            min: 0,
            default: 0,
        },
        vendor: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        ratingsAverage: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
