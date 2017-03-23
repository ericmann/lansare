/*!
 * Lansare
 *
 * Eric Mann <eric@eamann.com>
 *
 * MIT License.
 */

'use strict';

/**
 * Module dependencies
 */
var Dispatcher = require( './dispatcher' ),
	os = require( 'os' ),
	chalk = require( 'chalk' ),
	fs = require( 'fs' ),
	path = require( 'path' );

/**
 * Store a notification as a new entry in a logfile.
 *
 * @param {Object} config
 *
 * @return {Promise}
 */
function notify( config ) {
	// Dereference the array
	config = config.config;

	return new Promise( function( fulfill ) {
		// First things first, build up our log string
		// Date | User | Project | Environment | Description | Changelog | Revision
		var components = [];
		components.push( new Date().toString() );
		components.push( config.user );
		components.push( config.project );
		components.push( config.environment );
		components.push( config.desc );
		components.push( config.changelog ? config.changelog : 'none' );
		components.push( config.rev );

		var log = components.join( ' | ' ) + os.EOL;

		try {
			fs.appendFile( config.logfile, log, function( err ) {
				if ( err ) {
					throw err;
				}

				fulfill( 'Successfully updated `' + chalk.yellow( path.basename( config.logfile ) ) + '`!' );
			} );
		} catch ( e ) {
			process.stderr.write( chalk.red( 'Error writing to logfile!' ) + os.EOL );
			process.stderr.write( e );
			process.exit( 1 );
		}
	} );
}

/**
 * Dispatch and log an event to New Relic
 *
 * @constructor
 */
var LogFile_Dispatcher = function() {
	Dispatcher.call( this );

	return {
		notify: notify
	};
};

// Set the prototype chain
LogFile_Dispatcher.prototype = Object.create( Dispatcher.prototype );

// Set the constructor
LogFile_Dispatcher.prototype.constructor = LogFile_Dispatcher;

// Export the module
module.exports = LogFile_Dispatcher;
