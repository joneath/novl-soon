
/**
 * Module dependencies.
 */

var express = require('express')
  , hbs = require('express-hbs')
  , routes = require('./routes')
  , accounts = require('./routes/accounts')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  var templates = path.resolve('templates');
  app.engine('hbs', hbs.express3());
  app.set('views', templates);
  app.set('view engine', 'hbs');

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.post('/accounts', accounts.create);
app.get('/', routes.index);
app.get('/soon', routes.index);

app.configure('development', function(){
  var redis = require('redis');
  app.use(express.errorHandler());
  global.redisClient = redis.createClient();
  module.exports = app;
});

app.configure('production', function(){
  var redis = require('iris-redis');
  global.redisClient = redis.createClient(6379, 'nodejitsudb9237356320.redis.irstack.com',  {auth: "f327cfe980c971946e80b8e975fbebb4"});

  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
});
