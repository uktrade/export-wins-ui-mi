const jwt = require( 'jsonwebtoken' );

const config = require( '../config' );

const secret = config.jwt.secret;
const userCookieName = config.userCookieName;
const secure = !config.isDev;

module.exports = function( user, res, cb ){

	jwt.sign( user, secret, {

		algorithm: 'HS256',
		noTimestamp: true

	}, function( err, token ){

		if( err ){

			cb( err );

		} else {

			//TODO: Test what happens when this is called twice in the same request.
			res.cookie( userCookieName, token, {
				httpOnly: true,
				secure,
				expires: 0//session
			} );
			cb();
		}
	} );
};
