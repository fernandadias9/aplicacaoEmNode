const AppError = require('./utils/appError.js');
const routes = require('./routes');

/* Importing Express, the framework that handles HTTP requests. */
const express = require("express");

// Initializing Express
const app = express();

app.use(express.json());

/*Indicates which port the express should listen to to respond to requests. Structure: the express initializer "listens" to the PORT and the arrow function indicates what it should do when this happens.*/
const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));

//exception handling
app.use((error, request, response, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  } 

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  })
})

app.use(routes);