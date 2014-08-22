'use strict';

// Comment Schema Model ===============================

module.exports.Comment = function( body, author ){

  var comment = {};

  Object.defineProperties( comment, {

    body : {
      value : body,
      enumerable : true
    },

    author : {
      value : author,
      enumerable : true
    },

    date : {
      value : new Date(),
      enumerable : true
    }
  });

  return comment;
};