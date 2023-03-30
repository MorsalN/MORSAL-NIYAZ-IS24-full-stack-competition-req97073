// Requires
const Chance = require('chance');
const chance = new Chance();
const bodyParser = require("body-parser");
const express = require('express');
const path = require('path');
const fs = require('fs');

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

// Read the contents of the generated-data.json file and parse it as JSON
const jsonString = fs.readFileSync('generated-data.json', 'utf8');
const productsDatabase = JSON.parse(jsonString);
const productCount = Object.keys(productsDatabase).length;

// Set 
// What engine to use (View) and extention files to look at
app.set('view engine', 'ejs');


// Saved in generated-data.json
// Pre-populating JSON object with 40 sample products using Chance as a random generator
const products = {}; // empty object to store products

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
  products[i] = product;
}



// GET
// Home Endpoint
app.get('/api', (req, res) => {
  res.redirect('/api/products');
});

// Products Endpoint
app.get('/api/products', (req, res) => {
  // console.log('productDatabaseArray', productsDatabase);
  // console.log('count', productCount);
  const templateVars = {
    productList: productsDatabase,
    productCount: productCount
  };
  res.render('pages/index', templateVars);
});

// Add Products Endpoint
app.get('/api/products/add', (req, res) => {
  const templateVars = {
    productList: productsDatabase,
    productCount: productCount
  };
  res.render('pages/product_add', templateVars);
});

// View Details Product Endpoint
app.get('/api/products/:id/details', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = productsDatabase[productId];
  const templateVars = {
    product: product
  };
  res.render('pages/product_details', templateVars);
});

// Health Endpoint 
app.get("/api/health", (req, res) => {
  res.status(200).send('Component is healthy! :)');
});


// POST
// Handle Form Submission
app.post('/api/products/add', (req, res) => {
  const { names, productName, productOwnerName, scrumMasterName, startDate, methodology } = req.body;

  // Ensure ids are not the same
  // const newProductId = productCount + 1;

  // // Add a new product to the existing data
  const newProductData = {
    // productId: newProductId,
    productName,
    productOwnerName,
    names: names,
    scrumMasterName,
    startDate,
    methodology
  };
  productsDatabase[new Date().getTime()] = newProductData;

  // Write the updated data back to the file
  fs.writeFileSync('generated-data.json', JSON.stringify(productsDatabase));


  const templateVars = {
    productList: productsDatabase,
    productCount: productCount
  };

  res.redirect('/api');

});




// PORT
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})
