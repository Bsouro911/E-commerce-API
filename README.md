# Node.js E-Commerce REST API with MongoDB

***This is a Node.js-based E-Commerce REST API project that utilizes MongoDB as its database. The API provides endpoints for managing users, products, shopping carts, orders, and authentication. Below, you'll find a brief overview of the project structure and key components.***

## Project Structure
The project is organized into different directories and files, each serving a specific purpose.

### Models (/models)

- **cart.js**: Defines the schema for shopping carts, including cart items.
- **order.js**: Defines the schema for orders, which include products, quantities, and user information.
- **product.js**: Defines the schema for products, including name, price, and description.
- **user.js**: Defines the schema for user accounts, including authentication details.

### Routes (/routes)

- **cart.js**: Handles routes related to shopping carts, such as adding and removing items.
- **order.js**: Manages routes for creating and retrieving orders.
- **product.js**: Provides routes for managing products, including creation, retrieval, and modification.
- **user.js**: Handles routes for user-related operations, such as registration and profile updates.
- **auth.js**: Contains routes for user authentication and login.
- **verifyTokenMiddleware.js**: Middleware for verifying JSON Web Tokens (JWT) used in authentication.

### index.js

- This is the main entry point of the application, where the Express.js application is configured and routes are defined. It also establishes a connection to the MongoDB database using Mongoose.

## Getting Started

***Before running the application, you need to set up your environment variables using a `.env` file. The following environment variables are required:***

`MONGO_URL`: The MongoDB connection URL.
`PORT`: The port on which the server will listen (optional, default is 5500).

Ensure you have Node.js and MongoDB installed on your system. To start the server, run the following commands:

```sh
# Install project dependencies
npm install

# Start the server
npm start
```

## API Endpoints

- `/api/auth`: Authentication and login routes.
- `/api/users`: User registration and profile management.
- `/api/products`: Product CRUD operations.
- `/api/carts`: Shopping cart management.
- `api/orders`: Order creation and retrieval.

## Found a Bug

If you found an issue or would like to submit an improvement to this project, please submit an issue using the issue tab above. If you would like to submit a PR with a fix, reference the issue you created!

## License

[Bsouro911](https://github.com/Bsouro911) - Sourojyoti Biswas
