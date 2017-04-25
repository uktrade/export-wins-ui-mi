const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = function( req, res ){

	backendService.getSamlLogin().then( ( token ) => {

		res.render( 'login.html', { token } );

	} ).catch( renderError.createHandler( res ) );
};
