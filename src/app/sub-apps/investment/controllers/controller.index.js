const investmentService = require( '../../../lib/service/service.backend/investment' );
const renderError = require( '../../../lib/render-error' );

module.exports = function( req, res ){

	investmentService.getHomepageData( req ).then( ( data ) => {

		res.render( 'investment/views/index', data );

	} ).catch( renderError.createHandler( res ) );
};
