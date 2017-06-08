
const logger = require( './logger' );

function sendResponse( res, err ){

	logger.error( err );

	res.status( 500 );
	res.render( 'error/default.html', { error: err } );
}

module.exports = {

	sendResponse,

	createHandler: function( res ){

		return function( err ){

			if( err.code === 403 ){

				res.redirect( '/login/' );

			} else {

				sendResponse( res, err );
			}
		};
	}
};

