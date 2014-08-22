'use strict';

module.exports = function(input){
  var id = ['_'],
      possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < 5; i++ ){
    id.push( possible.charAt( Math.floor( Math.random() * possible.length )));
  }
  id = id.join('');
  return input.replace(/\s+/g, '').replace(/\W/g, '').substr(0,10) + id;
};