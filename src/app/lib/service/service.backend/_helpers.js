const config = require( '../../../config' );
const reporter = require( '../../reporter' );
const logger = require( '../../logger' );
const backend = ( config.backend.stub ? require( '../../backend-request.stub' ) : require( '../../backend-request' ) );

function createResponseHandler( resolve, reject ){

	return function( err, response, data ){

		if( err ){

			if( err.code === 'ECONNREFUSED' ){

				err = new Error( 'The backend is not available.' );
			}

			reject( err );

		} else {

			if( response.isSuccess ){

				resolve( { response, data } );

			} else {

				let message = 'Not a successful response from the backend.';
				let logType = 'error';

				if( response.statusCode === 403 ){

					message = 'Not logged in';
					logType = 'debug';
				}

				const e = new Error( message );

				e.code = response.statusCode;
				e.response = response;
				e.data = data;

				logger[ logType ]( 'Got a %s status code for url: %s', response.statusCode, response.request.uri.href );
				reject( e );
			}
		}
	};
}

function checkTime( start, end, name ){

	const time = ( end - start );

	if( time > config.backend.timeout ){

		reporter.message( 'info', `Long aggregate response time from ${ name }`, { time, name } );
	}
}

function addParamsFromReq( path, req ){

	const params = [ `year=${ req.year }` ];
	const dateRange = req.dateRange;

	if( dateRange ){

		if( dateRange.start ){

			params.push( `date_start=${ dateRange.start }` );
		}

		if( dateRange.end ){

			params.push( `date_end=${ dateRange.end }` );
		}
	}

	return ( path + '?' + params.join( '&' ) );
}

function sessionGet( path, req ){

	return new Promise( ( resolve, reject ) => {

		backend.sessionGet( req.cookies.sessionid, path, createResponseHandler( resolve, reject ) );
	} );
}


module.exports = {

	sessionGet,

	sessionPost: function( path, req, data ){

		return new Promise( ( resolve, reject ) => {

			backend.sessionPost( req.cookies.sessionid, path, data, createResponseHandler( resolve, reject ) );
		} );
	},

	getAll: function( name, promises, dataFormatter ){

		const start = Date.now();

		return Promise.all( promises ).then( ( data ) => {

			checkTime( start, Date.now(), name );

			return dataFormatter( data );
		} );
	},

	getJson: function( path, req, transform ){

		path = addParamsFromReq( path, req );

		return sessionGet( path, req ).then( ( info ) => {

			const response = info.response;
			const data = info.data;

			if( transform ){

				try {

					data.results = transform( data.results );

				} catch ( e ){

					logger.error( 'Unable to transform API response for url: %s', response.request.uri.href );
					logger.error( e );

					const err = new Error( 'Unable to transform API response' );
					err.stack = e.stack;
					throw( err );
				}
			}

			return data;
		} );
	}
};
