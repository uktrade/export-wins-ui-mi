
const config = require( '../config' );
const url = require( 'url' );
const crypto = require( 'crypto' );

module.exports = function( backendUrl, body ){

	let toHash = '';
	let parsedUrl = url.parse( backendUrl );

	toHash += parsedUrl.path;

	if( body ){
		
		toHash += body;
	}

	toHash += config.backend.secret;

	return crypto.createHash( 'sha256' ).update( toHash, 'utf8' ).digest( 'HEX' );
};
