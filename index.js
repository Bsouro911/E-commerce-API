// Import the Express framework
const express = require("express");

// Create an Express application
const app = express();

// Import the Mongoose library for MongoDB interaction
const mongoose = require("mongoose");

// Import the dotenv library to load environment variables from a .env file
const dotenv = require("dotenv");

// Import the user route
const userRoute = require("./routes/user");

// Import the authentication route
const authRoute = require("./routes/auth");

// Import the product route
const productRoute = require("./routes/product");

// Import the cart route
const cartRoute = require("./routes/cart");

// Import the order route
const orderRoute = require("./routes/order");

// Load environment variables from .env file
dotenv.config();

// Call the main function to connect to the database
main().catch((err) => console.log(err));

// Function to connect to the MongoDB database using Mongoose
async function main() {
  // Wait for the Mongoose connection to be established
  await mongoose
    .connect(process.env.MONGO_URL) // Connect to the MongoDB database using the URL from the environment variables
    .then(() => console.log("database is connected...")) // If the connection is successful, log a message
    .catch((err) => {
      console.log(err); // If there is an error during the connection, log the error
    });
}

// Parse incoming JSON data to be available in req.body
app.use(express.json());

// Set up routes for different endpoints
// For example, requests to "/api/authentications" will be handled by the authRoute
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

// Start the server and listen for incoming requests
app.listen(process.env.PORT || 5500, () => {
  // The server will listen on the specified port from the environment variables or default to 5500
  console.log("backend server is running...");
});
