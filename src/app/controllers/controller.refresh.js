const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );
const saveUser = require( '../lib/save-user' );
const reporter = require( '../lib/reporter' );

module.exports = function( req, res ){

	backendService.getUserInfo( req ).then( ( user ) => {

		req.user = user;
		res.locals.user = user;

		saveUser( req.user, res, function( err ){

			if( err ){

				const captureError = new Error( 'Unable to save user state' );
				captureError.saveError = err;
				reporter.captureException( captureError );
			}

			res.render( 'me' );
		} );

	} ).catch( renderError.createHandler( req, res ) );
};
