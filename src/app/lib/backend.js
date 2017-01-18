
const config = require( '../config' );
const request = require( 'request' );
const logger = require( './logger' );
const createSignature = require( './create-signature' );

const backendConfig = config.backend;
const backendUrl = `${ backendConfig.protocol }://${ backendConfig.host }:${ backendConfig.port }`;

function createRequestOptions( method, alice, path, body ){

	return {
		url: ( backendUrl + path ),
		method: method,
		headers: {
			'X-Signature': createSignature( path, body ),
			'Cookie': ( 'sessionid=' + alice.session )
		}
	};
}

function convertToJson( cb ){

	return function( err, response, data ){

		if( !err ){

			const isSuccess = ( response.statusCode >= 200 && response.statusCode < 300 );
			const isJson = ( response.headers[ 'content-type' ] === 'application/json' );

			response.isSuccess = isSuccess;

			if( !err && isJson ){

				try {

					data = JSON.parse( data );

				} catch( e ){
					
					logger.error( 'Unable to convert response to JSON for uri: %s', response.request.uri.href );
				}
			}
		}		

		cb( err, response, data );
	};
}

module.exports = {

	get: function( alice, path, cb ){

		logger.debug( 'Backend GET request to: ' + path );

		request( createRequestOptions( 'GET', alice, path ), convertToJson( cb ) );
	}
};
