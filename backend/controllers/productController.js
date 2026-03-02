import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('vendor', 'name storeProfile.storeName');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('vendor', 'name storeProfile.storeName');

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get vendor products
// @route   GET /api/products/vendor
// @access  Private/Vendor
export const getVendorProducts = async (req, res) => {
    try {
        const products = await Product.find({ vendor: req.user._id });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor
export const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, stock } = req.body;
        let images = [];

        if (req.files) {
            images = req.files.map((file) => file.path);
        }

        const product = new Product({
            title,
            description,
            price,
            images: images.length > 0 ? images : ['no-photo.jpg'],
            category,
            stock,
            vendor: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Vendor
export const updateProduct = async (req, res) => {
    try {
        const { title, description, price, category, stock } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if the user is the vendor who created the product
            if (product.vendor.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized to update this product' });
            }

            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock !== undefined ? stock : product.stock;

            if (req.files && req.files.length > 0) {
                product.images = req.files.map((file) => file.path);
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Vendor
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (product.vendor.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized to delete this product' });
            }

            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
