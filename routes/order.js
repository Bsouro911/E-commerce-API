// Import the Order model and middleware functions for verifying tokens and permissions
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAdmin,
} = require("./verifyTokenMiddleware");

// Create an instance of Express Router
const router = require("express").Router();

// Create Order
router.post("/", verifyToken, async (req, res) => {
  // Create a new Order instance with the data from the request body
  const newOrder = new Order(req.body);

  try {
    // Save the new Order to the database
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder); // Return the saved Order as JSON response
  } catch (err) {
    res.status(500).json(err); // If there's an error, return it as JSON response with a 500 status code
  }
});

// Update Order
router.put("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    // Find the Order by ID and update it with the data from the request body
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true } // Return the updated Order instead of the old one
    );
    res.status(200).json(updatedOrder); // Return the updated Order as JSON response
  } catch (err) {
    res.status(500).json(err); // If there's an error, return it as JSON response with a 500 status code
  }
});

// Delete Order
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    // Find the Order by ID and delete it
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted..."); // Return a success message as JSON response
  } catch (err) {
    res.status(500).json(err); // If there's an error, return it as JSON response with a 500 status code
  }
});

// Get User Order
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    // Find all Orders belonging to the specified user ID
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders); // Return the Orders as JSON response
  } catch (err) {
    res.status(500).json(err); // If there's an error, return it as JSON response with a 500 status code
  }
});

// Get All Orders
router.get("/", verifyTokenAdmin, async (req, res) => {
  try {
    // Find all Orders
    const orders = await Order.find();
    res.status(200).json(orders); // Return the Orders as JSON response
  } catch (err) {
    res.status(500).json(err); // If there's an error, return it as JSON response with a 500 status code
  }
});

// Get Monthly Income
router.get("/income", verifyTokenAdmin, async (req, res) => {
  // Calculate the date for the last month and the month before that
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    // Aggregate the Orders based on their creation date within the previous month
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income); // Return the aggregated income data as JSON response
  } catch (err) {
    res.status(500).json(err); // If there's an error, return it as JSON response with a 500 status code
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
