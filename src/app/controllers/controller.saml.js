const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = {

	acs: function( req, res ){

		backendService.sendSamlXml( req.data ).then( ( response ) => {

			res.redirect( '/' );

		} ).catch( renderError.createHandler( res ) );
	},

	metadata: function( req, res ){

		backendService.getSamlMetadata( req.alice ).then( ( xml ) => {

			res.set( 'Content-Type', 'text/xml' );
			res.send( xml );

		} ).catch( renderError.createHandler( res ) );
	}
};
