// Requires
const bodyParser = require("body-parser");
const express = require('express');
const app = express();
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

const PORT = 3000;

//  Use
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Set 
// What engine to use (View) and extention files to look at
app.set('view engine', 'ejs');


// Home Endpoint
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get("/urls", (req, res) => {
  res.send('Hello World 666666622');
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});





// PORT
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})
