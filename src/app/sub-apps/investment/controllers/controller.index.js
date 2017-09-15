const investmentService = require( '../../../lib/service/service.backend/investment' );

module.exports = function( req, res ){

	investmentService.getHomepageData( req ).then( ( data ) => {

		res.render( 'investment/views/index', data );
	} );
};
