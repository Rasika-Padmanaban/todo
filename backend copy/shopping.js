
// const express = require('express');
// const app = express();
// app.use(express.json());

// let products = [];

// // Endpoint to add a single product
// app.post('/products', async (req, res) => {
//     const {
//         name,
//         price,
//         description,
//         specifications,
//         stockStatus,
//         reviews
//     } = req.body;

//     const newProduct = {
//         id: products.length + 1,
//         name,
//         price,
//         description,
//         specifications,
//         stockStatus,
//         reviews
//     };

//     products.push(newProduct);
//     console.log(products);
//     res.status(201).json(newProduct);
// });

// // Endpoint to add multiple products
// app.post('/products/bulk', async (req, res) => {
//     const items = req.body.items;
//     items.forEach(item => {
//         const newProduct = {
//             id: products.length + 1,
//             name: item.name,
//             price: item.price,
//             description: item.description,
//             specifications: item.specifications,
//             stockStatus: item.stockStatus,
//             reviews: item.reviews
//         };
//         products.push(newProduct);
//     });
//     console.log(products);
//     res.status(201).json(products);
// });

// // Endpoint to update a product by ID
// app.put('/products/:id', async (req, res) => {
//     const { id } = req.params;
//     const {
//         name,
//         price,
//         description,
//         specifications,
//         stockStatus,
//         reviews
//     } = req.body;

//     const productIndex = products.findIndex(p => p.id === parseInt(id));
//     if (productIndex === -1) {
//         return res.status(404).json({ message: 'Product not found' });
//     }

//     products[productIndex] = {
//         id: parseInt(id),
//         name,
//         price,
//         description,
//         images,
//         specifications,
//         stockStatus,
//         reviews
//     };

//     console.log(products);
//     res.status(200).json(products[productIndex]);
// });

// // Endpoint to get all products
// app.get('/products', async (req, res) => {
//     res.status(200).json(products);
// });

// // Endpoint to get a single product by ID
// app.get('/products/:id', async (req, res) => {
//     const { id } = req.params;
//     const product = products.find(p => p.id === parseInt(id));
//     if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json(product);
// });

// const port = 3000;
// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });

//code to intergrate with mongodb
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// MongoDB connection setup
const mongoURI = 'mongodb://localhost:27017/productsdb'; // Replace with your MongoDB URI
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Product schema and model for pearls
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    specifications: {
        pearlType: { type: String },
        pearlShape: { type: String },
        pearlSize: { type: String },
        pearlColor: { type: String },
        luster: { type: String },
        necklaceLength: { type: String },
        claspType: { type: String },
        metalType: { type: String }
    },
    stockStatus: { type: String, required: true },
    reviews: [{
        user: { type: String },
        rating: { type: Number },
        comment: { type: String }
    }],
    relatedProducts: [{ type: String }],
    careInstructions: { type: String },
    origin: { type: String },
    certification: { type: String }
});

const Product = mongoose.model('Product', productSchema);

// Endpoint to add a single product
app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: 'Error adding product', error: err });
    }
});

// Endpoint to add multiple products
app.post('/products/bulk', async (req, res) => {
    try {
        const products = await Product.insertMany(req.body.items);
        res.status(201).json(products);
    } catch (err) {
        res.status(400).json({ message: 'Error adding products', error: err });
    }
});

// Endpoint to update a product by ID
app.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: 'Error updating product', error: err });
    }
});

// Endpoint to get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving products', error: err });
    }
});

// Endpoint to get a single product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving product', error: err });
    }
});
// Update product by ID
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ message: 'Error updating product', error });
    }
});
//delete
app.delete('/products/:id', async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting product', error: err });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});


