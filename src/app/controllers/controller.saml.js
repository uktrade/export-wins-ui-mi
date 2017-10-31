const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );
const reporter = require( '../lib/reporter' );
const getSessionId = require( '../lib/get-session-id' );

module.exports = {

	acs: function( req, res ){

		backendService.sendSamlXml( req ).then( ( info ) => {

			const response = info.response;
			const cookies = response.headers[ 'set-cookie' ];
			const sessionCookie = getSessionId( cookies );

			res.set( 'Set-Cookie', [ sessionCookie ] );
			res.redirect( '/' );

		} ).catch( ( e ) => {

			switch( e.response && e.response.statusCode ){

				case 403:

					res.render( 'error/not-mi.html' );
					reporter.message( 'info', 'User not in MI group' );

				break;
				case 500:

					res.render( 'error/unable-to-login.html' );
					reporter.captureException( e );

				break;
				default:

					renderError.sendResponse( res, e );
					reporter.captureException( e );

				break;
			}
		} );
	},

	metadata: function( req, res ){

		backendService.getSamlMetadata( req ).then( ( xml ) => {

			res.set( 'Content-Type', 'text/xml' );
			res.send( xml );

		} ).catch( renderError.createHandler( req, res ) );
	}
};
