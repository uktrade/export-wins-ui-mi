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

				const headers = err.response.headers;
				const preferauthwith = headers.preferauthwith;

				if( preferauthwith && preferauthwith === 'oauth2' ){

					res.redirect( '/login/' );

				} else {

					res.redirect( '/login-saml/' );
				}

			} else {

				sendResponse( res, err );
			}
		};
	}
};
