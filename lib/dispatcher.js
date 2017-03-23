/*!
 * Lansare
 *
 * Eric Mann <eric@eamann.com>
 *
 * MIT License.
 */

'use strict';

var Dispatcher = function() {
	/**
	 * Stub out the notify interface.
	 *
	 * @param {Object} config
	 */
	this.notify = function( config ) {
		config = config.config;
		throw 'Subclasses must implement the notify() method.';
	};
};


// Export the module
module.exports = Dispatcher;
