var _ = require('lodash'),
    express = require('express'), 
    home = require('./routes/home'),
    http = require('http'),
    path = require('path')
    engine = require('ejs-locals'),
    LedgerRest = require('ledger-rest').LedgerRest;

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', engine);
  
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Example ledger .dat file from the appendix of the Ledger 3 manual
  var ledgerRest = new LedgerRest({ file: 'example/example.dat' });
  
  app.use('/api', function (req, res) {
    ledgerRest.server.server.emit('request', req, res);
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var routes = [
  '/',
  '/income', '/income/*',
  '/spending', '/spending/*',
  '/worth', '/worth/*',
  '/balance', '/balance/*',
];

_.each(routes, function(route) {
  app.get(route, home.index);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});