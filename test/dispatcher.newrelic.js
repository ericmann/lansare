'use strict';

var assert = require( 'assert' ),
  NewRelic_Dispatcher = require( '../lib/dispatcher.newrelic' );

describe( 'newrelic dispatcher', function() {
  it( 'defines a notify method', function() {
    var dispatcher = new NewRelic_Dispatcher();

    assert( dispatcher.notify );
  } );
} );
