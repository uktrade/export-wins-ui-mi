
const config = require( '../config' );
const request = require( 'request' );
const logger = require( 'winston' );
const createSignature = require( './createSignature' );

const backendConfig = config.backend;
const backendUrl = `${ backendConfig.protocol }://${ backendConfig.host }:${ backendConfig.port }`;

function createRequestOptions( method, path, body ){

	return {
		url: ( backendUrl + path ),
		method: method,
		headers: {
			'X-Signature': createSignature( path, body )
		}
	};
}

function convertToJson( cb ){

	return function( err, resopnse, data ){

		if( !err && typeof data == 'string' ){

			try {

				data = JSON.parse( data );

			} catch( e ){
				
				logger.error( 'Unable to convert response to JSON' );
			}
		}

		cb( err, resopnse, data );
	};
}

module.exports = {

	get: function( path, cb ){

		request( createRequestOptions( 'GET', path ), convertToJson( cb ) );
	},

	post: function( path, body, cb ){

		request( createRequestOptions( 'POST', path, body ), convertToJson( cb ) );
	}
};
