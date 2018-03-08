const fdiService = require( '../../../lib/service/service.backend/investment/fdi' );
const renderError = require( '../../../lib/render-error' );
const performanceHeadlinesViewModel = require( '../view-models/fdi-performance-headlines' );
const performanceDetailsViewModel = require( '../view-models/fdi-performance-details' );
const performanceWinProgressViewModel = require( '../view-models/fdi-performance-win-progress' );

module.exports = function( req, res ){

	fdiService.getHomepageData( req ).then( ( data ) => {

		res.render( 'investment/views/index', {

			dateRange: data.performance.date_range,
			headlines: performanceHeadlinesViewModel.create( data.performance.results ),
			details: performanceDetailsViewModel.create( data.performance.results ),
			sectors: performanceWinProgressViewModel.create( data.sectors.results ),
			tab: {
				isSectors: true,
				isOverseasRegions: false,
				isUkRegions: false
			}
		} );

	} ).catch( renderError.createHandler( req, res ) );
};
