
const logger = require( './logger' );

function sendResponse( res, err ){

	logger.error( err );

	res.render( 'error', { error: err } );
}

module.exports = {

	sendResponse,

	createHandler: function( res ){

		return function( err ){

			sendResponse( res, err );
		};
	}
};

