import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'Please add a rating between 1 and 5'],
        },
        comment: {
            type: String,
            required: [true, 'Please add a comment'],
        },
    },
    {
        timestamps: true,
    }
);

// Prevent user from submitting more than one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function (productId) {
    const obj = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 },
            },
        },
    ]);

    try {
        if (obj[0]) {
            await this.model('Product').findByIdAndUpdate(productId, {
                ratingsAverage: Math.round(obj[0].averageRating * 10) / 10,
                ratingsQuantity: obj[0].numOfReviews,
            });
        } else {
            await this.model('Product').findByIdAndUpdate(productId, {
                ratingsAverage: 0,
                ratingsQuantity: 0,
            });
        }
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
reviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.product);
});

// Call getAverageRating before remove
reviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
