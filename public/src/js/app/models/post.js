'use strict';

// Post Schema Model ===============================

var mongoose = require( 'mongoose' );

var postSchema = mongoose.Schema({
  
  title:  String,
  slug: String,
  author: Object,
  body:   String,
  comments: Array,
  date: { type: Date, default: new Date() },

  meta: {
    votes: Number,
    favs:  Number
  }
});

module.exports = mongoose.model( 'Post', postSchema );