'use strict';

var toSlug = require('./toSlug');

module.exports = function( app, db ){


  // Landing Page ===============================
  // Renders all posts on index.html
  
  app.get('/', function( req, res ){
    db.collection( 'posts' ).find({}, function( err, cursor ){
      cursor.toArray( function( err, docs ){
        res.render( 'index', { posts : docs });
      });
    });
  });

  // View Post ===============================
  // Renders a single post based on the slug.
  
  app.get( '/post/:slug', function( req, res ){
    var slug = req.params.slug;

    db.collection( 'posts' ).findOne( { slug : slug }, function( err, doc ){
      res.render( 'post', { post : doc });
    });
  });

  // New Post Page ===============================
  // Renders the new post page
  
  app.get( '/newPost', function( req, res ){
    res.render('newPost', { posted : false });
  });

  // Post New Post ===============================
  // Creates a new post from data
  // Redirects to the newly created post page
  
  app.post( '/newPost', function( req, res ){
    var postBody = req.body.postBody,
        postTitle = req.body.postTitle;

    db.collection( 'posts' ).insert({

      title : postTitle,
      body : postBody,
      slug : toSlug( postTitle ),
      date : new Date(),
      comments : []

    }, function( err, records){
      console.log( records );
      res.redirect( '/post/' + records[0].slug );
    });
  });

  // Add a Comment to a Post ===============================
  // Adds the comment and re-renders the current post page.
  
  app.post( '/comment/:slug', function( req, res ){

    var slug = req.params.slug,
        comment = req.body.comment;

    db.collection( 'posts' ).findAndModify(
      { slug : slug },
      [],
      {
        $push : {
          comments : {
            comment : comment,
            commentId : toSlug( comment ),
            date : new Date()
          }
        },
      },
      { new : true },
      function( err, doc ){
        if (err){
          console.warn( err.message );
        } else {
          res.redirect('/post/' + doc.slug );
        }
      }
    );
  });

  // Removes a Comment Based on  ===============================
  // Redirects to the current post page.
  
  app.get( '/removeComment/:slug/:commentId', function( req, res ){

    var slug = req.params.slug,
        commentId = req.params.commentId;

    db.collection( 'posts' ).findAndModify(
      { slug : slug },
      [],
      {
        $pull : {
          comments : { commentId : commentId }
        },
      },
      { new : true },
      function( err, doc ){
        res.redirect( '/post/' + slug );
      }
    );
  });

  app.get( '/editAllPosts', function( req, res ){
    db.collection( 'posts' ).find({}, function( err, cursor ){
      cursor.toArray( function( err, docs ){
        res.render( 'editAllPosts', { posts : docs });
      });
    });
  });

  app.get( '/removePost/:slug', function( req, res ){
    var slug = req.params.slug;

    db.collection( 'posts' ).remove( { slug : slug }, function( err ){
      db.collection( 'posts' ).find({}, function( err, cursor ){
        cursor.toArray( function( err, docs ){
          res.render( 'editAllPosts', { posts : docs });
        });
      });
    });
  });

  app.post( '/editPost/:slug', function( req, res ){
    var slug = req.params.slug,
        postTitle = req.body.postTitle,
        postBody = req.body.postBody;

    db.collection( 'posts' ).findAndModify(
      { slug : slug },
      [],
      {
        $set : {
          title : postTitle,
          body : postBody,
          slug : toSlug( postTitle ),
          date : new Date()
        },
      },
      { new : true },
      function( err, doc ){
        if (err){
          console.warn( err.message );
        } else {
          res.redirect('/post/' + doc.slug );
        }
      }
    );
  });

  app.get( '/editPost/:slug', function( req, res ){
    var slug = req.params.slug;
    db.collection( 'posts' ).findOne( { slug : slug }, function( err, doc ){
      console.log( doc );
      res.render( 'editPost', { post : doc } );
    });
  });
};