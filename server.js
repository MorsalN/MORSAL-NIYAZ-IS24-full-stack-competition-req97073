// Requires
const Chance = require('chance');
const chance = new Chance();
const bodyParser = require("body-parser");
const express = require('express');
const path = require('path');

// const product_data = require('.product_data'); // store and retrieve product data

const app = express();
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

const PORT = 3000;


//  Use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // to let express know all static folders are in public
app.set('views', path.join(__dirname, 'views'));
// app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Set 
// What engine to use (View) and extention files to look at
app.set('view engine', 'ejs');


// Pre-populating JSON object with 40 sample products using Chance as a random generator
const productsDatabase = []; // create an empty array to store products

for (let i = 1; i <= 40; i++) { // loop through 40 times to generate 40 products
  const product = {
    productId: i,
    productName: chance.sentence({ words: 3 }),
    productOwnerName: chance.name(),
    Developers: [
      chance.name(),
      chance.name(),
      chance.name(),
      chance.name(),
      chance.name()
    ],
    scrumMasterName: chance.name(),
    startDate: chance.date({ string: true, american: false }),
    methodology: chance.pickone(['Agile', 'Waterfall'])
  };
  productsDatabase.push(product); // add the generated product to the products array
}


// GET
// Home Endpoint
app.get('/api', (req, res) => {
  res.redirect('/api/products');
});

// Products Endpoint
app.get('/api/products', (req, res) => {
  // console.log('productDatabaseArray', productsDatabase);
  const templateVars = {
    productList: productsDatabase
  };
  res.render('pages/index', templateVars);
});

// View Details Product Endpoint
app.get('/api/products/:id/details', (req, res) => {
  const productId = req.params.id;
  const product = productsDatabase.find(p => p.productId == productId);
  const templateVars = {
    product: product
  };
  res.render('pages/details', templateVars);
});

// Health Endpoint 
app.get("/api/health", (req, res) => {
  res.status(200).send('Component is healthy! :)');
});





// PORT
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})
