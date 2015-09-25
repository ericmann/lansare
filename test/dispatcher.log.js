'use strict';

var assert = require( 'assert' ),
	LogFile_Dispatcher = require( '../lib/dispatcher.log' );

describe( 'logfile dispatcher', function() {
	it( 'defines a notify method', function() {
		var dispatcher = new LogFile_Dispatcher();

		assert( dispatcher.notify );
	} );
} );
