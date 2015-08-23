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
	Error = require( './error' );

var E_NO_APP_NAME_OR_ID = new Error( 1, 'No application name or ID.' ),
	E_NO_DESCRIPTION = new Error( 2, 'No deployment description.' ),
	E_NO_REVISION = new Error( 4, 'No revision hash or ID.' ),
	E_NO_USER = new Error( 8, 'No user for deployment.' ),
	E_NO_CONFIG = new Error( 16, 'No `.lansarc` file in project.' );

function Parser( program ) {
	var error = 0;

	// First things first, let's figure out if there is a `.lansarc` file.
	var config_file = path.resolve( '.lansarc' );
	if ( fs.existsSync( config_file ) ) {
		var config = require( config_file );

		if ( ! config.app || ( ! config.app.name && ! config.app.id ) ) {
			error = error ^ E_NO_APP_NAME_OR_ID.code;
		}
	} else {
		error = error ^ E_NO_CONFIG.code;
	}

	if ( ! program.desc ) {
		error = error ^ E_NO_DESCRIPTION.code;
	}

	if ( ! program.rev ) {
		error = error ^ E_NO_REVISION.code;
	}

	if ( ! program.user ) {
		error = error ^ E_NO_USER.code;
	}

	return {
		error: error
	};
}

module.exports = Parser;