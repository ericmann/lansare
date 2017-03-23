/*!
 * Lansare
 *
 * Eric Mann <eric@eamann.com>
 *
 * MIT License.
 */

'use strict';

/**
 * Build out a read-only error
 *
 * @param {Number} _code    Machine-readable error code
 * @param {String} _message Human-readable error message
 *
 * @constructor
 */
function Error( _code, _message ) {
	var SELF = this;

	/**
	 * Return the error code.
	 *
	 * @returns {Number}
	 */
	Object.defineProperty( this, 'code', {
		value: _code,
		writable: false,
		enumerable: false,
		configurable: false
	} );

	/**
	 * Return just the error message.
	 *
	 * @returns {String}
	 */
	SELF.toString = function() {
		return _message;
	};
}

module.exports = Error;
