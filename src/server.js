/* Importing Express, the framework that handles HTTP requests. */
const express = require("express");

// Initializing Express
const app = express();

app.use(express.json());

/*Indicates which port the express should listen to to respond to requests. Structure: the express initializer "listens" to the PORT and the arrow function indicates what it should do when this happens.*/
const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));

const routes = require('./routes');
app.use(routes);