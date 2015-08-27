'use strict';

var assert = require( 'assert' ),
	Dispatcher = require( '../lib/dispatcher' );

describe( 'dispatcher', function() {
	it( 'stubs a notify method', function() {
		var dispatcher = new Dispatcher();

		assert( dispatcher.notify );
	} );

	it( 'throws an error with incomplete notify', function() {
		var dispatcher = new Dispatcher();

		var thrown = false;
		try {
			dispatcher.notify( {} );
		} catch( e ) {
			assert.equal( 'Subclasses must implement the notify() method.', e );
			thrown = true;
		}

		assert( thrown );
	} );
} );