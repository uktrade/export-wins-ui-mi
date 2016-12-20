const config = require( '../../config' );
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

		next();
	}
};
