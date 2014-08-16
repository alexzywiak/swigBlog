'use strict';

var express = require('express'),
    app = express(),
    cons = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    router = require('./router.js'),
    bodyParser = require('body-parser'),
    filters = require('./swigFilters')(),

    dataBase = 'swigBlog',
    port = 8080;

app.engine( 'html', cons.swig );
app.set( 'view engine', 'html' );
app.set( 'views', __dirname + '/views' );
app.use( express.static( __dirname + '/public' ) );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var mongoclient = new MongoClient(
  new Server(
    'localhost',
    27017,
    { 'native_parser': true }
  )),
db = mongoclient.db( dataBase );

router( app, db );

mongoclient.open( function( err, mongoclient ){
  if( err ){
    throw err;
  }
  app.listen( port );
  console.log( 'Your pearls of wisdom can be found at ' + port );
});