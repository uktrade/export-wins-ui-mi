const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = function( req, res ){

	backendService.getSamlLogin( req ).then( ( info ) => {

		const response = info.response;
		const token = info.data;

		res.set( 'Set-Cookie', response.headers[ 'set-cookie' ] );

		res.render( 'login.html', { token } );

	} ).catch( renderError.createHandler( res ) );
};
