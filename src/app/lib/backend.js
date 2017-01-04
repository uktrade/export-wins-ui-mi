
const config = require( '../config' );
const request = require( 'request' );
const logger = require( 'winston' );
const createSignature = require( './createSignature' );

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

		if( !err && typeof data === 'string' ){

			try {

				data = JSON.parse( data );

			} catch( e ){
				
				logger.error( 'Unable to convert response to JSON' );
			}
		}

		cb( err, response, data );
	};
}

module.exports = {

	get: function( alice, path, cb ){

		logger.debug( 'Backend GET request to: ' + path );

		let opts = createRequestOptions( 'GET', alice, path );

		console.dir( opts );

		request( opts, convertToJson( cb ) );
	},

	post: function( alice, path, body, cb ){

		request( createRequestOptions( 'POST', alice, path, body ), convertToJson( cb ) );
	}
};
