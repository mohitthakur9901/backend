const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/Sample', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

const Product = mongoose.model("Product", productSchema);


//Create Product Api
app.post("/api/v1/product/new", async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(200).json({
            success: true,
            product: newProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create product"
        });
    }
});


//Read Product Api
app.get("/api/v1/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to get products"
        });
    }
});

//update Product Api

app.put("/api/v1/product/:id", async (req, res) => {
    let product = await Product.findById(req.params.id);

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    res.status(200).json({
        success: true,
        product: product
    })
});

//Delete Product Api

app.delete("/api/v1/product/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndRemove(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            deletedProduct
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
