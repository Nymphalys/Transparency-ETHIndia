var path = require('path');
var express = require('express');
var router = express.Router();
var app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/build');
var server = app.listen(app.get('port'), function() {
  console.log('listening on port ', server.address().port);
});


// Home page route.
router.get('/dashboard.html', function (req, res) {
  res.render('dashboard.html');
})
