// Requires
const Chance = require('chance');
const chance = new Chance();
const bodyParser = require("body-parser");
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

const PORT = 3000;


//  Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // to let express know all static folders are in public
// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Read the contents of the generated-data.json file and parse it as JSON
const jsonString = fs.readFileSync('generated-data.json', 'utf8');
const productsDatabase = JSON.parse(jsonString);
const productCount = Object.keys(productsDatabase).length;

// Set View Engine and Views Path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Saved in generated-data.json
// Pre-populating JSON object with 40 sample products using Chance as a random generator
const products = {}; // empty object to store products

for (let i = 1; i <= 40; i++) {
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
  try {
    res.redirect('/api/products');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Products Endpoint
app.get('/api/products', (req, res) => {
  try {
    // Using template for variables to render on the index page
    const templateVars = {
      productList: productsDatabase,
      productCount: productCount
    };
    res.status(200).render('pages/index', templateVars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add Products Endpoint
app.get('/api/products/add', (req, res) => {
  try {
    const templateVars = {
      productList: productsDatabase,
      productCount: productCount
    };
    res.status(200).render('pages/product_add', templateVars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// View Details Product Endpoint
app.get('/api/products/:id/details', (req, res) => {
  try {
    // Turning id from the request from string to integer 
    const productId = parseInt(req.params.id);
    const product = productsDatabase[productId];
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      const templateVars = {
        productId: productId,
        productName: product.productName,
        productOwnerName: product.productOwnerName,
        Developers: product.Developers,
        scrumMasterName: product.scrumMasterName,
        startDate: product.startDate,
        methodology: product.methodology
      };
      res.status(200).render('pages/product_details', templateVars);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Products Count Endpoint
app.get('/api/products/count', (req, res) => {
  try {
    res.status(200).json({ count: productCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit Product Endpoint
app.get('/api/products/:id/edit', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = productsDatabase[productId];
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      const templateVars = {
        productId: productId,
        productName: product.productName,
        productOwnerName: product.productOwnerName,
        Developers: product.Developers,
        scrumMasterName: product.scrumMasterName,
        startDate: product.startDate,
        methodology: product.methodology
      };
      res.status(200).render('pages/product_edit', templateVars);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Health Endpoint Test
app.get("/api/health", (req, res) => {
  res.status(200).send('Component is healthy! :)');
});


// POST
// Add Products Endpoint
app.post('/api/products/add', (req, res) => {
  try {
    const { Developers, productName, productOwnerName, scrumMasterName, startDate, methodology } = req.body;

    // Ensure ids are not the same
    const newProductId = productCount + 1;

    // Add a new product to the existing data
    const newProductData = {
      productId: newProductId,
      productName,
      productOwnerName,
      Developers,
      scrumMasterName,
      startDate,
      methodology
    };
    productsDatabase[newProductId] = newProductData;

    // Write the updated data back to the file
    fs.writeFileSync('generated-data.json', JSON.stringify(productsDatabase));

    res.status(201).redirect('/api/products');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit Product Endpoint
app.post('/api/products/:id/edit', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { Developers, productName, productOwnerName, scrumMasterName, startDate, methodology } = req.body;

    // Update the existing product data
    productsDatabase[productId].productName = productName;
    productsDatabase[productId].productOwnerName = productOwnerName;
    productsDatabase[productId].Developers = Developers;
    productsDatabase[productId].scrumMasterName = scrumMasterName;
    productsDatabase[productId].startDate = startDate;
    productsDatabase[productId].methodology = methodology;

    // Write the updated data back to the file
    fs.writeFileSync('generated-data.json', JSON.stringify(productsDatabase));

    res.status(200).redirect('/api/products');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE
// Delete Product Endpoint
app.post("/api/products/:id/delete", (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    delete productsDatabase[productId];

    // Write the updated data back to the file
    fs.writeFileSync('generated-data.json', JSON.stringify(productsDatabase));

    res.status(200).redirect('/api/products');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PORT
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})
