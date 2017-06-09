const driver = require( './driver' );
const config = require( '../test-config' );

module.exports = function fetch( path ){

	const url = `${ config.baseUrl }${ path }`;

	//console.log( `Fetching: ${ url }` );

	return driver.get( url );
};
