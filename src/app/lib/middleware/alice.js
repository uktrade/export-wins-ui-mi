const config = require( '../../config' );
const logger = require( 'winston' );
const jwt = require( 'jsonwebtoken' );

const secret = config.backend.uiSecret;

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

		let err = new Error( 'No token in cookies' );

		logger.error( err.message );

		res.render( 'error', { error: err } );
	}
};
