const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// Route: POST /register
// Description: Registers a new user in the system
router.post("/register", async (req, res) => {
  // Create a new user object with the provided username, email, and encrypted password
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password, // User's plain text password
      process.env.PASS_SEC // Secret key used for encryption
    ).toString(),
  });

  try {
    // Save the new user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); // Return the saved user as JSON response
  } catch (err) {
    res.status(500).json(err); // If an error occurs, return the error as JSON response
  }
});

// Route: POST /login
// Description: Authenticates a user and generates a JSON Web Token (JWT) for further authorization
router.post("/login", async (req, res) => {
  try {
    // Find the user in the database based on the provided username
    const user = await User.findOne({
      username: req.body.username,
    });

    // If the user does not exist in the database, return an error response
    !user && res.status(401).json("Wrong User Name");

    // Decrypt the hashed password from the user object using the secret key
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password, // Encrypted password stored in the database
      process.env.PASS_SEC // Secret key used for decryption
    );

    // Convert the decrypted password to a plain text string
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    // Compare the input password with the decrypted password
    // If they don't match, return an error response
    const inputPassword = req.body.password; // User's plain text password
    originalPassword != inputPassword && res.status(401).json("Wrong Password");

    // If the password is correct, generate a JSON Web Token (JWT)
    const accessToken = jwt.sign(
      {
        id: user._id, // User's ID
        isAdmin: user.isAdmin, // A flag indicating if the user is an admin
      },
      process.env.JWT_SEC, // Secret key used to sign the JWT
      { expiresIn: "3d" } // Token expiration time (3 days in this case)
    );

    // Remove the password field from the user object to avoid sending it in the response
    const { password, ...others } = user._doc;

    // Return the user data and the access token as a JSON response
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err); // If an error occurs, return the error as JSON response
  }
});

module.exports = router;
