const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

// Create redis client
let client = redis.createClient();

client.on('connect', function () {
  console.log("Connected to Redis");
});

// Set port
const port = 3000;

// Init app
const app = express();


// View engines
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Methodoverride
app.use(methodOverride('_method'));

app.get('/', function (req, res, next) {
  res.render('searchusers');
});

// Search page
app.post('/user/search', function (req, res, next) {
  let id = req.body.id;

  client.hgetall(id, function (err, obj) {
    if (!obj) {
      res.render('searchusers', {
        error: 'User does not exist'
      });
    } else {
      obj.id = id;
      res.render('details', {
        user: obj
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});