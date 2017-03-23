/*!
 * Lansarere
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
	querystring = require( 'querystring' ),
	http = require( 'https' );

/**
 * Trigger a notification to New Relic.
 *
 * @param {Object} config
 *
 * @return {Promise}
 */
function notify( config ) {
	// Dereference the array
	config = config.config;

	return new Promise( function( fulfill, reject ) {
		var data = {
			'deployment[description]': config.desc,
			'deployment[revision]':    config.rev,
			'deployment[user]':        config.user
		};

		if ( config.name ) {
			data['deployment[app_name]'] = config.name;
		}

		if ( config.nrid ) {
			data['deployment[application_id]'] = config.nrid;
		}

		if ( config.changelog ) {
			data['deployment[changelog]'] = config.changelog;
		}

		var options = {
			hostname: 'api.newrelic.com',
			port:     443,
			path:     '/deployments.xml',
			method:   'POST',
			headers:  {
				'Content-Type': 'application/x-www-form-urlencoded',
				'x-api-key':    config.api_key
			}
		};

		// Send our post to New Relic
		var request = http.request( options, function() {
			fulfill( 'Successfully notified New Relic.' );
		} ).on( 'error', function( e ) {
			console.log( 'problem with request: ' + e.message );
			reject();
		} );

		request.write( querystring.stringify( data ) );

		// Close the request immediately.
		request.end();
	} );
}

/**
 * Dispatch and log an event to New Relic
 *
 * @constructor
 */
var NewRelic_Dispatcher = function() {
	Dispatcher.call( this );

	return {
		notify: notify
	};
};

// Set the prototype chain
NewRelic_Dispatcher.prototype = Object.create( Dispatcher.prototype );

// Set the constructor
NewRelic_Dispatcher.prototype.constructor = NewRelic_Dispatcher;

// Export the module
module.exports = NewRelic_Dispatcher;
