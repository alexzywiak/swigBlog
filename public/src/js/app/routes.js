'use strict';

var User    = require( '../src/js/app/models/user.js' ),
    Post    = require( '../src/js/app/models/post.js' ),
    Comment = require( '../src/js/app/models/comment.js').Comment,
    toSlug  = require( './toSlug.js' );

module.exports = function( app, passport ){

// Main Page ===============================
// Gets all posts

  app.get( [ '/', '/index' ], function( req, res ){
    Post.find( {}, function( err, posts ){
      if( err ){
        throw err;
      }
      
      res.render( 'index', { user : req.user, posts : posts } );
    });
  });

// Login Routes ===============================

  app.get( '/login', function( req, res ){
    res.render( 'login', { message : req.flash( 'loginMessage' ) });
  });

  app.post( '/login', passport.authenticate( 'local-login', {
    successRedirect : '/index',
    failureRedirect  : '/login',
    failureFlash    : true
  }));

// Logout Route ===============================

  app.get( '/logout', function( req, res ){
    req.logout();
    res.render( 'index' );
  });

// Signup Routes ===============================

  app.get( '/signup', function( req, res ){
    res.render( 'signup', { message : req.flash( 'signupMessage' ) });
  });

  app.post( '/signup', passport.authenticate( 'local-signup', {
    successRedirect : '/index',
    failureRedirect  : '/signup',
    failureFlash    : true
  }));

// New Post ===============================

  app.get( '/newPost', function( req, res ){
    res.render( 'newPost', { user : req.user } );
  });

  app.post( '/newPost', function( req, res ){
    var postTitle = req.body.postTitle,
        postBody  = req.body.postBody;


    var newPost = new Post();

    newPost.title     = postTitle;
    newPost.slug      = toSlug( postTitle );
    newPost.body      = postBody;
    newPost.author    = { id : req.user.id, email : req.user.local.email };

    newPost.save( function( err, post ){
      if( err ){
        throw err;
      }
      res.redirect( '/post/' + post.slug );
    });
  });

// View Single Post ===============================

  app.get( '/post/:slug', function( req, res){
    
    var slug = req.params.slug;

    console.log( slug );

    Post.findOne( { 'slug' : slug }, function( err, post ){
      console.log( post );
      res.render( 'post', { user : req.user, post : post } );
    });
  });

// Edit All Posts ===============================

  app.get( '/editAllPosts', function( req, res ){

    Post.find( {}, function( err, posts ){
      res.render( 'editAllPosts', { user : req.user, posts : posts });
    });
  });

// Edit Single Post ===============================

  app.get( '/editPost/:slug', function( req, res ){

    var slug = req.params.slug;

    Post.findOne( { 'slug' : slug }, function( err, post ){
      if( err ){
        throw err;
      }

      res.render( 'editPost', { user : req.user, post : post } );
    });
  });

  app.post( '/editPost/:slug', function( req, res ){

    var slug = req.params.slug,
        postTitle = req.body.postTitle,
        postBody  = req.body.postBody;

    Post.findOneAndUpdate(
      { 'slug' : slug },
      { $set : { title : postTitle, body  : postBody } },
      function( err, post ){
        if( err ){
          throw err;
        }
        res.render( 'editPost', { user : req.user, post : post } );
      }
    );
  });

// Remove Post ===============================

  app.get( '/removePost/:slug', function( req, res ){

    var slug = req.params.slug;

    Post.findOneAndRemove(
      { 'slug' : slug },
      function( err ){
        if( err ){
          throw err;
        }
        res.redirect( '/editAllPosts' );
      }
    );
  });

// Comments ===============================

  app.post( '/comment/:slug', function( req, res ){

    var slug = req.params.slug,
        commentBody = req.body.comment,
        commentAuthor = req.user;

    var newComment = {
      slug    : toSlug( commentBody ),
      body    : commentBody,
      author  : { id : commentAuthor.id, email : commentAuthor.local.email },
      date    : new Date()
    };

    Post.findOneAndUpdate(
      { 'slug' : slug },
      { $push : { 'comments' : newComment } },
      function( err, post ){
        if( err ){
          throw err;
        }
        res.render( 'post', { user : req.user, post : post } );
      }
      );
  });

  app.get( '/removeComment/:postSlug/:commentSlug', function( req, res ){

    var postSlug    = req.params.postSlug,
        commentSlug = req.params.commentSlug;

    Post.findOneAndUpdate(
      { 'slug' : postSlug },
      {
        $pull : {
          'comments' : {
            'slug' : commentSlug
          }
        }
      },
      function( err, post ){
        if( err ){
          throw err;
        }
        res.render( 'post', { user : req.user, post : post });
      }
    );
  });
};