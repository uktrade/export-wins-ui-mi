const fdiService = require( '../../../lib/service/service.backend/investment/fdi' );
const renderError = require( '../../../lib/render-error' );
const performanceHeadlinesViewModel = require( '../view-models/fdi-performance-headlines' );
const performanceDetailsViewModel = require( '../view-models/fdi-performance-details' );

module.exports = function( req, res ){

	fdiService.getHomepageData( req ).then( ( data ) => {

		res.render( 'investment/views/index', {

			dateRange: data.performance.date_range,
			headlines: performanceHeadlinesViewModel.create( data.performance.results ),
			details: performanceDetailsViewModel.create( data.performance.results ),
			sectors: data.sectors.results
		} );

	} ).catch( renderError.createHandler( req, res ) );
};
