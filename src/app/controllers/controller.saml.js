const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = {

	acs: function( req, res ){

		backendService.sendSamlXml( req ).then( ( info ) => {

			const response = info.response;

			res.set( 'Set-Cookie', response.headers[ 'set-cookie' ] );
			res.redirect( '/' );

		} ).catch( ( e ) => {

			if( e.code === 403 ){

				res.render( 'error-not-mi.html' );

			} else {

				renderError.sendResponse( res, e );
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
