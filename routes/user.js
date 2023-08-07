const {
  verifyTokenAdmin,
  verifyTokenAndAuthorization,
} = require("./verifyTokenMiddleware");

const router = require("express").Router();

const User = require("../models/User");

// // TEST API
// router.get("/usertest", (req, res) => {
//     res.send("user test is successfull!");
// });

// router.post("/userposttest", (req, res) => {
//     const username = req.body.username;
//     res.send(`your username is ${username}`)
// });

// Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  // Check if the request body contains a password
  if (req.body.password) {
    // Encrypt the password using AES encryption and the provided secret key
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    // Find and update the user with the specified id
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true } // Return the updated user as the response
    );
    res.status(200).json(updatedUser); // Send the updated user as the response
  } catch (err) {
    // If an error occurs during the update process, handle it
    // console.error(err); // Log the error message to the console
    res.status(500).json(err); // Send an error response with status code 500
  }
});

// Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    // Find and delete the user with the specified id
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been Deleted!"); // Send a success message as the response
  } catch (err) {
    // If an error occurs during the delete process, handle it
    // console.error(err); // Log the error message to the console
    res.status(500).json(err); // Send an error response with status code 500
  }
});

// Get User
router.get("/find/:id", verifyTokenAdmin, async (req, res) => {
  try {
    // Find the user with the specified id
    const user = await User.findById(req.params.id);
    // Destructure the user object to remove the password before sending the response
    const { password, ...others } = user._doc;
    res.status(200).json(others); // Send the user details (without the password) as the response
  } catch (err) {
    // If an error occurs during the get user process, handle it
    // console.error(err); // Log the error message to the console
    res.status(500).json(err); // Send an error response with status code 500
  }
});

// Get All Users
router.get("/", verifyTokenAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    // Check if the query parameter 'new' is provided
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5) // If 'new' is true, find the latest 5 users
      : await User.find(); // If 'new' is not provided or false, find all users
    res.status(200).json(users); // Send the list of users as the response
  } catch (err) {
    // If an error occurs during the get all users process, handle it
    // console.error(err); // Log the error message to the console
    res.status(500).json(err); // Send an error response with status code 500
  }
});

// Get User Stats
router.get("/stats", verifyTokenAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    // Aggregate user data based on the month of creation in the last year
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data); // Send the aggregated data as the response
  } catch (err) {
    res.status(500).json(err); // Send an error response with status code 500
  }
});

module.exports = router;
