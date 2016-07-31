express = require('express');
bodyParser = require('body-parser');
MongoClient = require('mongodb').MongoClient;
var path = require('path');
var db;

app = express();

if (app.get('env') === 'development') {
  require('dotenv').config();
}

db_username = process.env.DB_USERNAME;
db_password = process.env.DB_PASSWORD;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

MongoClient.connect('mongodb://' + db_username + ':' + db_password + '@ds031865.mlab.com:31865/quotes', function(err, database) {
  if (err) return console.log(err);
  db = database;
  app.listen(process.env.PORT, function() {
    console.log('Listening on port ' + process.env.PORT);
  });
});

app.get('/', function(req, res) {
  var cursor = db.collection('quotes').find().toArray(function(err, results) {
    if (err) {
      return console.log(err);
    }
    else {
      res.render('index.ejs', {quotes: results});
    }
    });
});

app.post('/quotes', function(req, res) {
  db.collection('quotes').save(req.body, function(err, result) {
    if (err) return console.log(err);
    res.redirect('/');
  });
});
