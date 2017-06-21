const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );
const reporter = require( '../lib/reporter' );

module.exports = {

	acs: function( req, res ){

		backendService.sendSamlXml( req ).then( ( info ) => {

			const response = info.response;

			res.set( 'Set-Cookie', response.headers[ 'set-cookie' ] );
			res.redirect( '/' );

		} ).catch( ( e ) => {

			switch( e.code ){

				case 403:

					res.render( 'error/not-mi.html' );

				break;
				case 500:

					res.render( 'error/unable-to-login.html' );
					reporter.captureException( e );

				break;
				default:

					renderError.sendResponse( res, e );

				break;
			}
		} );
	},

	metadata: function( req, res ){

		backendService.getSamlMetadata( req ).then( ( xml ) => {

			res.set( 'Content-Type', 'text/xml' );
			res.send( xml );

		} ).catch( renderError.createHandler( res ) );
	}
};
