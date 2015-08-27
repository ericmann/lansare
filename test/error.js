'use strict';

var Err = require( '../lib/error' ),
	assert = require( 'assert' );

describe( 'Error', function() {
	it( 'has code', function() {
		var error = new Err( 5, 'Test string' );

		assert.equal( 5, error.code );
	} );

	it( 'has a read-only code', function() {
		var error = new Err( 5, 'Test string' );

		var thrown = false;
		try {
			error.code = 10;
		} catch( e ) {
			thrown = true;
		}

		assert.equal( 5, error.code );
		assert( thrown );
	} );

	it( 'has human-readable string', function() {
		var error = new Err( 0, 'Human-readable string' );

		assert.equal( 'Human-readable string', error.toString() );
	} );
} );