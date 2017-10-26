const jwt = require( 'jsonwebtoken' );

const config = require( '../config' );
const backend = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const secret = config.jwt.secret;
const userCookieName = config.userCookieName;

module.exports = function( isDev ){

	const secure = !isDev;

	return function( req, res, next ){

		const token = req.cookies[ userCookieName ];

		if( token ){

			jwt.verify( token, secret, function( err, payload ){

				if( err ){

					next( err );

				} else {

					req.user = payload;
					res.locals.user = payload;
					next();
				}
			} );

		} else {

			backend.getUserInfo( req ).then( ( user ) => {

				req.user = user;
				res.locals.user = user;

				jwt.sign( user, secret, {

					algorithm: 'HS256',
					noTimestamp: true

				}, function( err, token ){

					if( err ){

						next( err );

					} else {

						res.cookie( userCookieName, token, {
							httpOnly: true,
							secure,
							expires: 0//session
						} );
						next();
					}
				} );

			} ).catch( renderError.createHandler( res ) );
		}
	};
};
