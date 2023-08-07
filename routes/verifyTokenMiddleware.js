// Import the 'jsonwebtoken' library to handle JSON Web Tokens
const jwt = require("jsonwebtoken");

// Middleware function to verify if a user has a valid token
const verifyToken = (req, res, next) => {
  // Get the token from the 'token' field in the request headers
  const authHeader = req.headers.token;
  if (authHeader) {
    // Extract the actual token from the 'Bearer <token>' format
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret key stored in the environment variable JWT_SEC
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err)
        // If there's an error during token verification, return an error response
        res.status(403).json("Token is not valid!");
      else {
        // If the token is valid, attach the 'user' object (decoded from the token) to the 'req' object
        req.user = user;
        // Call the 'next' function to move to the next middleware or route handler
        next();
      }
    });
  } else {
    // If there's no 'token' field in the request headers, return an unauthorized error response
    return res.status(401).json("You are not authenticated!");
  }
};

// Middleware function to verify if a user has a valid token and is authorized to access certain routes
const verifyTokenAndAuthorization = (req, res, next) => {
  // Call the 'verifyToken' middleware to check if the user has a valid token
  verifyToken(req, res, () => {
    // Check if the user is authorized (either has the same 'id' as requested or is an admin)
    if (req.user.id === req.params.id || req.user.isAdmin) {
      // If authorized, call the 'next' function to proceed to the next middleware or route handler
      next();
    } else {
      // If not authorized, return a forbidden error response
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

// Middleware function to verify if a user has a valid token and is an admin
const verifyTokenAdmin = (req, res, next) => {
  // Call the 'verifyToken' middleware to check if the user has a valid token
  verifyToken(req, res, () => {
    // Check if the user is an admin
    if (req.user.isAdmin) {
      // If the user is an admin, call the 'next' function to proceed to the next middleware or route handler
      next();
    } else {
      // If the user is not an admin, return a forbidden error response
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

// Export the middleware functions to be used in other parts of the application
module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAdmin };
