/*!
 * Lansa
 *
 * Eric Mann <eric@eamann.com>
 *
 * MIT License.
 */

'use strict';

/**
 * Module dependencies
 */
var os = require( 'os' ),
	Package = require( '../package.json' ),
	Program = require( 'commander' ),
	chalk = require( 'chalk' ),
	Parser = require( './parser' );

/**
 * Helper function to split a comma-delimited list into individual items
 *
 * @param {String} value
 *
 * @returns {Array}
 */
function list( value ) {
	return value.split( ',' );
}

// Queue up our CLI options
Program
	.version( Package.version )
	.usage( '<project>:<environment> [options]' )
	.option( '-d, --desc <desc>', 'Description of deployment' )
	.option( '-c, --changelog <changelog>', 'Description of changes included' )
	.option( '-r, --rev <revision>', 'Deployed revision' )
	.option( '-u, --user <user>', 'Deploying user' )
	.option( '--dispatcher <dispatcher>', 'Dispatcher to use for notifications' )
	.option( '--recipients <list of emails>', 'Email recipients (for email dispatcher only)', list )
	.option( '--logfile <log file>', 'Destination log (for log dispatcher only)' )
	.parse( process.argv );

// If nothing, print help and exit
if ( process.argv.length <= 2 ) {
	Program.help();
	process.exit( 0 );
}

// Parse the passed arguments for validity
var parsed = new Parser( Program.args );

// Add a newline for readability
if ( parsed.error ) {
	process.stderr.write( os.EOL );
}

// Handle any error codes
if ( parsed.error & 1 ) {
	process.stderr.write( chalk.red( 'Either the application name or ID must be specified!' ) + os.EOL );
}
if ( parsed.error & 2 ) {
	process.stderr.write( chalk.red( 'A deployment description is required!' ) + os.EOL );
}
if ( parsed.error & 4 ) {
	process.stderr.write( chalk.red( 'A revision ID or hash is required!' ) + os.EOL );
}
if ( parsed.error & 8 ) {
	process.stderr.write( chalk.red( 'A user is required!' ) + os.EOL );
}

// If we had an error code at all, die
if ( parsed.error ) {
	process.stderr.write( os.EOL );
	process.exit( 1 );
}

// No error, so get our dispatcher
var Dispatcher;
switch ( Program.dispatcher.toLowerCase() ) {
	case 'email':
		Dispatcher = require( './dispatcher.email.js' );
		break;
	case 'log':
		Dispatcher = require( './dispatcher.log.js' );
		break;
	case 'newrelic':
	default:
		Dispatcher = require( './dispatcher.newrelic.js' );
}

// Log our notification
Dispatcher.notify( parsed ).then( function( message ) {
	process.stdout.write( os.EOL + chalk.green( message ) + os.EOL );
} );