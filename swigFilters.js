'use strict';

var swig = require('swig');

module.exports = function(){

  swig.setFilter('toSlug', function( input ){
    return input.replace(/\s+/g, '').replace(/\W/g, '');
  });
};