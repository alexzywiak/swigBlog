'use strict';

// server.js

// Setup ===============================
// Get all them sweet, sweet Dependencies

var express      = require('express'),
    app          = express(),
    port         = process.env.PORT || 8080,
    mongoose     = require('mongoose'),
    passport     = require('passport'),
    flash        = require('connect-flash'),
    cons         = require('consolidate'),

    morgan       = require('morgan'),
    cookieparser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    session      = require('express-session'),

    configDb     = require('./config/database.js');

// Configuration ===============================

mongoose.connect( configDb.url );

require('./config/passport')( passport );

// Middlewarez
app.use( morgan( 'dev' ) );
app.use( cookieparser() );
app.use( bodyParser() );
app.use( flash() );

// Set up views and static files
app.engine( 'html', cons.swig );
app.set( 'view engine', 'html' );
app.set( 'views', __dirname + '/views' );
app.use( express.static( __dirname + '/public' ) );

// Passport
app.use( session({ secret : 'daswigblog' }));
app.use( passport.initialize() );
app.use( passport.session() );

// Routes ===============================
require('./app/routes.js')( app, passport );

// Launch It! ===============================
app.listen( port );
console.log( 'The sweet digital symphony is happenin on ' + port );









