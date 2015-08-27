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
var path = require( 'path' ),
	fs = require( 'fs' ),
	Err = require( './error' );

/**
 * Error message pseudo-constants
 */
var E_NO_APP_NAME_OR_ID   = new Err( 1,  'No application name or ID.' ),
	E_NO_DESCRIPTION      = new Err( 2,  'No deployment description.' ),
	E_NO_REVISION         = new Err( 4,  'No revision hash or ID.' ),
	E_NO_USER             = new Err( 8,  'No user for deployment.' ),
	E_NO_CONFIG           = new Err( 16, 'No `.lansarc` file in project.' ),
	E_INVALID_ENVIRONMENT = new Err( 32, 'Invalid CLI invocation.' );

/**
 * Main CLI parsing routine.
 *
 * @param {Object} program Parsed program configuration from Commander
 *
 * @returns {{error: number, config: {}}}
 *
 * @constructor
 */
function Parser( program ) {
	var error = 0,
		app_config = {};

	// First things first, let's figure out if there is a `.lansarc` file.
	var config_file = path.resolve( '.lansarc' );
	if ( fs.existsSync( config_file ) ) {
		var config = JSON.parse( fs.readFileSync( config_file, 'utf8' ) );

		// Make sure the .lansarc file is configured properly
		if ( ! config.projects ) {
			error = error ^ E_NO_CONFIG.code;
		} else {

			// Make sure .lansarc specifies at least one enviornment
			if ( program.args.length < 1 ) {
				error = error ^ E_INVALID_ENVIRONMENT.code;
			} else {

				// Split up the parameters passed in to identify the project:enviornment
				var args = program.args[0].split( ':' );

				// If we don't have the right specification, err
				if ( 2 !== args.length ) {
					error = error ^ E_INVALID_ENVIRONMENT.code;
				} else {
					try {
						// Try to grab the configuration for the application we're deploying
						app_config = config.projects[ args[0] ][ args[1] ];

						if ( ! app_config.name && ! app_config.nrid ) {
							error = error ^ E_NO_APP_NAME_OR_ID.code;
						}
					} catch ( e ) {
						// Something went wrong reading our configuration file!
						error = error ^ E_NO_APP_NAME_OR_ID.code;
					}

				}
			}
		}
	} else {
		error = error ^ E_NO_CONFIG.code;
	}

	/**
	 * Map required parameters and, if not set, add to our error bitmask
	 */

	if ( ! program.desc ) {
		error = error ^ E_NO_DESCRIPTION.code;
	} else {
		app_config.desc = program.desc;
	}

	if ( ! program.rev ) {
		error = error ^ E_NO_REVISION.code;
	} else {
		app_config.rev = program.rev;
	}

	if ( ! program.user ) {
		error = error ^ E_NO_USER.code;
	} else {
		app_config.user = program.user;
	}

	/**
	 * Map some optional parameters
	 */

	app_config.changelog = program.changelog;
	app_config.dispatcher = program.dispatcher;

	if ( program.logfile ) {
		app_config.logfile = path.resolve( program.logfile );
	}

	// Return our parsed configuration
	return {
		error : error,
		config: app_config
	};
}

// Export the module
module.exports = Parser;