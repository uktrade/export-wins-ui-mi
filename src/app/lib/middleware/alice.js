const config = require( '../../config' );
const logger = require( '../logger' );
const jwt = require( 'jsonwebtoken' );

const secret = config.cookieSecret;

module.exports = function( req, res, next ){

	const token = req.cookies.alice;

	if( token ){

		jwt.verify( token, secret, function( err, data ){

			if( !err ){

				req.alice = data;
				next();

			} else {

				res.render( 'error', { error: err } );
			}
		} );

	} else {

		let err = new Error( 'Not logged in' );

		logger.error( err.message );

		res.render( 'error', { error: err } );
	}
};
