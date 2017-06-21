const config = require( '../config' );
const reporter = require( './reporter' );

function sendResponse( res, err ){

	res.status( 500 );
	res.render( 'error/default.html', { error: err, showErrors: config.showErrors } );

	reporter.captureException( err );
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

