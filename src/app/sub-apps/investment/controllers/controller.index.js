const fdiService = require( '../../../lib/service/service.backend/investment/fdi' );
const renderError = require( '../../../lib/render-error' );

module.exports = function( req, res ){

	fdiService.getHomepageData( req ).then( ( data ) => {

		res.render( 'investment/views/index', data );

	} ).catch( renderError.createHandler( res ) );
};
