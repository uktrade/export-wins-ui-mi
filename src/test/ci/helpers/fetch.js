const driver = require( './driver' );
const config = require( '../test-config' );
const increaseTimeout = require( './increase-timeout' );

module.exports = function fetch( path ){

	increaseTimeout();

	const url = `${ config.baseUrl }${ path }`;

	//console.log( `Fetching: ${ url }` );

	return driver.get( url );
};
