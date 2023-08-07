// Import the verifyTokenAdmin middleware from the 'verifyTokenMiddleware.js' file
const { verifyTokenAdmin } = require("./verifyTokenMiddleware");

// Import the Express Router
const router = require("express").Router();

// Import the Product model from the 'Product.js' file
const Product = require("../models/Product");

// Create a new Product
router.post("/", verifyTokenAdmin, async (req, res) => {
  // Create a new Product instance with data from the request body
  const newProduct = new Product(req.body);

  try {
    // Save the new Product to the database
    const savedProduct = await newProduct.save();
    // Respond with the saved Product as JSON
    res.status(200).json(savedProduct);
  } catch (err) {
    // If there's an error, respond with a 500 status and the error as JSON
    res.status(500).json(err);
  }
});

// Update a Product
router.put("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    // Find the Product by ID and update its data with the data from the request body
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      // Set the 'new' option to true to return the updated Product instead of the old one
      { new: true }
    );
    // Respond with the updated Product as JSON
    res.status(200).json(updatedProduct);
  } catch (err) {
    // If there's an error, respond with a 500 status and the error as JSON
    res.status(500).json(err);
  }
});

// Delete a Product
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    // Find the Product by ID and delete it from the database
    await Product.findByIdAndDelete(req.params.id);
    // Respond with a success message as JSON
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    // If there's an error, respond with a 500 status and the error as JSON
    res.status(500).json(err);
  }
});

// Get a Product by ID
router.get("/find/:id", async (req, res) => {
  try {
    // Find the Product by ID in the database
    const product = await Product.findById(req.params.id);
    // Respond with the found Product as JSON
    res.status(200).json(product);
  } catch (err) {
    // If there's an error, respond with a 500 status and the error as JSON
    res.status(500).json(err);
  }
});

// Get All Products
router.get("/", async (req, res) => {
  // Get query parameters 'new' and 'category' from the request URL
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;

    // If the 'new' query parameter is present, get the latest 5 Products sorted by creation date
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    }
    // If the 'category' query parameter is present, get all Products that belong to that category
    else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    }
    // If there are no query parameters, get all Products
    else {
      products = await Product.find();
    }

    // Respond with the found Products as JSON
    res.status(200).json(products);
  } catch (err) {
    // If there's an error, respond with a 500 status and the error as JSON
    res.status(500).json(err);
  }
});

// Get Products Stats (requires admin authentication)
router.get("/stats", verifyTokenAdmin, async (req, res) => {
  // Get the current date
  const date = new Date();
  // Get the date one year ago from the current date
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    // Use MongoDB aggregation to get product statistics for the last year
    const data = await Product.aggregate([
      { $match: { createdAt: { $gte: lastYear } } }, // Filter products created in the last year
      {
        $project: {
          month: { $month: "$createdAt" }, // Extract the month from the 'createdAt' field
        },
      },
      {
        $group: {
          _id: "$month", // Group products by the month they were created
          total: { $sum: 1 }, // Count the number of products in each group (month)
        },
      },
    ]);
    // Respond with the product statistics as JSON
    res.status(200).json(data);
  } catch (err) {
    // If there's an error, respond with a 500 status and the error as JSON
    res.status(500).json(err);
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
