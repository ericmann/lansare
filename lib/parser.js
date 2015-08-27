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

var E_NO_APP_NAME_OR_ID = new Err( 1, 'No application name or ID.' ),
	E_NO_DESCRIPTION = new Err( 2, 'No deployment description.' ),
	E_NO_REVISION = new Err( 4, 'No revision hash or ID.' ),
	E_NO_USER = new Err( 8, 'No user for deployment.' ),
	E_NO_CONFIG = new Err( 16, 'No `.lansarc` file in project.' ),
	E_INVALID_ENVIRONMENT = new Err( 32, 'Invalid CLI invocation.' );

function Parser( program ) {
	var error = 0,
		app_config = {};

	// First things first, let's figure out if there is a `.lansarc` file.
	var config_file = path.resolve( '.lansarc' );
	if ( fs.existsSync( config_file ) ) {
		var config = JSON.parse( fs.readFileSync( config_file, 'utf8' ) );

		if ( ! config.projects ) {
			error = error ^ E_NO_CONFIG.code;
		} else {
			if ( program.args.length < 1 ) {
				error = error ^ E_INVALID_ENVIRONMENT.code;
			} else {
				var args = program.args[0].split( ':' );

				if ( args.length < 2 ) {
					error = error ^ E_INVALID_ENVIRONMENT.code;
				} else {
					try {
						app_config = config.projects[ args[0] ][ args[1] ];

						if ( ! app_config.name && ! app_config.nrid ) {
							error = error ^ E_NO_APP_NAME_OR_ID.code;
						}
					} catch ( e ) {
						error = error ^ E_NO_APP_NAME_OR_ID.code;
					}

				}
			}
		}
	} else {
		error = error ^ E_NO_CONFIG.code;
	}

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

	if ( program.changelog ) {
		app_config.changelog = program.changelog;
	}

	return {
		error : error,
		config: app_config
	};
}

module.exports = Parser;