const config = require( '../../config' );
const jwt = require( 'jsonwebtoken' );
const renderError = require( '../render-error' );

const secret = config.cookieSecret;

module.exports = function( req, res, next ){

	const token = req.cookies.alice;

	if( token ){

		jwt.verify( token, secret, function( err, data ){

			if( !err ){

				req.alice = data;
				next();

			} else {

				renderError.sendResponse( res, err );
			}
		} );

	} else {

		let err = new Error( 'Not logged in' );

		renderError.sendResponse( res, err );
	}
};
