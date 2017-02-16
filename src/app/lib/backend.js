const config = require( '../config' );
const request = require( 'request' );
const raven = require( 'raven' );
const logger = require( './logger' );
const createSignature = require( './create-signature' );

const haveSentry = !!config.sentryDsn;
const backendHref = config.backend.href;

function createRequestOptions( method, alice, path, body ){

	return {
		url: ( backendHref + path ),
		time: true,
		method: method,
		headers: {
			'X-Signature': createSignature( path, body ),
			'Cookie': ( 'sessionid=' + alice.session )
		}
	};
}

function checkResponseTime( response ){

	if( response.elapsedTime > config.backend.timeout ){

		if( haveSentry ){

			raven.captureMessage( 'Long response time from backend API', {
				level: 'info',
				extra: {
					time: response.elapsedTime,
					path: response.request.uri.path
				}
			} );

		} else {

			logger.warn( 'Slow response from backend API. %s took %sms', response.request.uri.path, response.elapsedTime );
		}
	}
}

function handleResponse( cb ){

	return function( err, response, data ){

		if( !err ){
			
			const isSuccess = ( response.statusCode >= 200 && response.statusCode < 300 );
			const isJson = ( response.headers[ 'content-type' ] === 'application/json' );

			response.isSuccess = isSuccess;

			checkResponseTime( response );

			if( isJson ){

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

		request( createRequestOptions( 'GET', alice, path ), handleResponse( cb ) );
	}
};
