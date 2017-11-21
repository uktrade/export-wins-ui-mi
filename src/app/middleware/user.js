const jwt = require( 'jsonwebtoken' );

const config = require( '../config' );
const backend = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );
const saveUser = require( '../lib/save-user' );

const secret = config.jwt.secret;
const userCookieName = config.userCookieName;

module.exports = function( req, res, next ){

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

			saveUser( user, res, next );

		} ).catch( renderError.createHandler( req, res ) );
	}
};
