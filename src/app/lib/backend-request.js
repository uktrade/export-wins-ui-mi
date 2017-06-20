const config = require( '../config' );
const request = require( 'request' );
const logger = require( './logger' );
const reporter = require( './reporter' );
const createSignature = require( './create-signature' );

const backendHref = config.backend.href;

function createRequestOptions( method, path, opts = { body: null, sessionId: null } ){

	const options = {
		url: ( backendHref + path ),
		time: true,
		method: method,
		headers: {
			'X-Signature': createSignature( path, opts.body )
		}
	};

	if( opts.sessionId ){

		options.headers[ 'Cookie' ] = ( 'sessionid=' + opts.sessionId );
	}

	if( opts.body ){

		options.body = opts.body;

		if( method === 'POST' ){

			options.headers[ 'Content-Type' ] = 'application/x-www-form-urlencoded';
		}
	}

	return options;
}

function checkResponseTime( response ){

	const time = response.elapsedTime;

	if( time > config.backend.timeout ){

		let path = response.request.uri.path;

		reporter.message( 'info', `Long response time from backend API: ${path}`, {
			time,
			path
		} );
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

	get: function( path, cb ){

		logger.debug( 'Backend GET request to: ' + path );

		request( createRequestOptions( 'GET', path ), handleResponse( cb ) );
	},

	sessionGet: function( sessionId, path, cb ){

		logger.debug( 'Backend GET request to: ' + path );

		request( createRequestOptions( 'GET', path, { sessionId } ), handleResponse( cb ) );
	},

	post: function( path, body, cb ){

		logger.debug( 'Backend POST request to: ' + path );

		request( createRequestOptions( 'POST', path, { body } ), handleResponse( cb ) );
	},

	sessionPost: function( sessionId, path, body, cb ){

		logger.debug( 'Backend POST request to: ' + path );

		request( createRequestOptions( 'POST', path, { sessionId, body } ), handleResponse( cb ) );
	}
};
