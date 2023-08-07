// Import the Cart model and verification middleware functions
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAdmin,
} = require("./verifyTokenMiddleware");

// Import the Express Router
const router = require("express").Router();

// Route to create a new Cart
router.post("/", verifyToken, async (req, res) => {
  // Create a new instance of the Cart model using the request body data
  const newCart = new Cart(req.body);

  try {
    // Save the new cart to the database
    const savedCart = await newCart.save();
    // Respond with the saved cart as JSON data
    res.status(200).json(savedCart);
  } catch (err) {
    // If there's an error, respond with a 500 status and the error as JSON
    res.status(500).json(err);
  }
});

// Route to update an existing Cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    // Find the cart by ID and update it with the new data from the request body
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true } // Return the updated cart as the response
    );
    // Respond with the updated cart as JSON data
    res.status(200).json(updatedCart);
  } catch (err) {
    // If there's an error, respond with a 500 status and the error as JSON
    res.status(500).json(err);
  }
});

// Route to delete a Cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    // Find the cart by ID and delete it from the database
    await Cart.findByIdAndDelete(req.params.id);
    // Respond with a success message as JSON data
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    // If there's an error, respond with a 500 status and the error as JSON
    res.status(500).json(err);
  }
});

// Route to get a User's Cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    // Find the cart associated with the given user ID
    const cart = await Cart.findOne({ userId: req.params.userId });
    // Respond with the found cart as JSON data
    res.status(200).json(cart);
  } catch (err) {
    // If there's an error, respond with a 500 status and the error as JSON
    res.status(500).json(err);
  }
});

// Route to get all Carts (for admin only)
router.get("/", verifyTokenAdmin, async (req, res) => {
  try {
    // Find all carts in the database
    const carts = await Cart.find();
    // Respond with the array of carts as JSON data
    res.status(200).json(carts);
  } catch (err) {
    // If there's an error, respond with a 500 status and the error as JSON
    res.status(500).json(err);
  }
});

// Export the router to be used by the main Express app
module.exports = router;
