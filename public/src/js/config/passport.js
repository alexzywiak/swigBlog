'use strict';

// Configure Passport ===============================

// Load Dependencies
var LocalStrategy = require( 'passport-local' ).Strategy,
    User          = require( '../src/js/app/models/user.js' );

module.exports = function( passport ){

  // Session Setup ===============================

  passport.serializeUser( function( user, done ){
    console.log( user.id );
    done( null, user.id );
  });

  passport.deserializeUser( function( id, done ){
    User.findById( id, function( err, user ){
      done( err, user );
    });
  });

  // Strategy Setup ===============================
  
  passport.use( 'local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function( req, email, password, done ){

      process.nextTick( function(){

        User.findOne( { 'local.email' : email }, function( err, user ){

          if( err ){
            return done( err );
          }

          if( user ){
            return done( null, false, req.flash( 'signupMessage', 'That email is already taken!' ));
          } else {

            var newUser = new User();

            newUser.local.email     = email;
            newUser.local.password  = newUser.generateHash( password );

            newUser.save( function( err ){
              if( err ){
                throw err;
              }
              return done( null, newUser );
            });
          }
        });
      });
    }
  ));

  passport.use( 'local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function( req, email, password, done ){

    User.findOne( { 'local.email' : email }, function( err, user ){

      if( err ){
        return done( err );
      }
      if( !user ){
        return done( null, false, req.flash( 'loginMessage', 'Existential Crisis! That user does not exist!' ) );
      }
      if( !user.validPassword( password ) ){
        return done( null, false, req.flash( 'loginMessage', 'You be hackin bro!  That is not the right password.' ) );
      }
      return done( null, user );
    });
  }));
};