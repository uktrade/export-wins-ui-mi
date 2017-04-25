const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = {

	acs: function( req, res ){

		backendService.sendSamlXml( req ).then( ( info ) => {

			const response = info.response;

			for( let cookie of response.headers[ 'set-cookie' ] ){

				res.set( 'Set-Cookie', cookie );
			}

			res.redirect( '/' );

		} ).catch( renderError.createHandler( res ) );
	},

	metadata: function( req, res ){

		backendService.getSamlMetadata( req ).then( ( xml ) => {

			res.set( 'Content-Type', 'text/xml' );
			res.send( xml );

		} ).catch( renderError.createHandler( res ) );
	}
};
