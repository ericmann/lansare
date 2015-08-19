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
var Dispatcher = require( './dispatcher' );

/**
 * Dispatch and log an event to New Relic
 *
 * @constructor
 */
var NewRelic_Dispatcher = function() {
	Dispatcher.call( this );
};

// Set the prototype chain
NewRelic_Dispatcher.prototype = Object.create( Dispatcher.prototype );

// Set the constructor
NewRelic_Dispatcher.prototype.constructor = NewRelic_Dispatcher;

// Export the module
module.exports = NewRelic_Dispatcher;