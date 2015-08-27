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

// Queue up our CLI options
Program
	.version( Package.version )
	.usage( '<project>:<environment> [options]' )
	.option( '-d, --desc <desc>', 'Description of deployment' )
	.option( '-c, --changelog <changelog>', 'Description of changes included' )
	.option( '-r, --rev <revision>', 'Deployed revision' )
	.option( '-u, --user <user>', 'Deploying user' )
	.option( '--dispatcher <dispatcher>', 'Dispatcher to use for notifications' )
	.option( '--logfile <log file>', 'Destination log (for log dispatcher only)' )
	.parse( process.argv );

// If nothing, print help and exit
if ( process.argv.length <= 2 ) {
	Program.help();
	process.exit( 0 );
}

// Parse the passed arguments for validity
var parsed = new Parser( Program );

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
if ( parsed.error & 16 ) {
	process.stderr.write( chalk.red( 'You must configure a `' + chalk.yellow( '.lansarc' ) + '` file in the project root.' ) + os.EOL );
}
if ( parsed.error & 32 ) {
	process.stderr.write( chalk.red( 'Please specify an environment as configured in the `' + chalk.yellow( '.lansarc' ) + '` file.' ) + os.EOL );
}

// If we had an error code at all, die
if ( parsed.error ) {
	process.stderr.write( os.EOL );
	process.exit( 1 );
}

// No error, so get our dispatcher
var Dispatcher;
Program.dispatcher = Program.dispatcher || 'newrelic';
switch ( Program.dispatcher.toLowerCase() ) {
	case 'log':
		Dispatcher = require( './dispatcher.log.js' );
		break;
	case 'newrelic':
	default:
		Dispatcher = require( './dispatcher.newrelic.js' );
}

var dispatcher = new Dispatcher();

// Log our notification
dispatcher.notify( parsed ).then( function( message ) {
	process.stdout.write( os.EOL + chalk.green( message ) + os.EOL );
} );