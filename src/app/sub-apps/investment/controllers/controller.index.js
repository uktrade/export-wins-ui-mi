const fdiService = require( '../../../lib/service/service.backend/investment/fdi' );
const renderError = require( '../../../lib/render-error' );
const performanceHeadlinesViewModel = require( '../view-models/fdi-performance-headlines' );
const performanceDetailsViewModel = require( '../view-models/fdi-performance-details' );
const performanceWinProgressViewModel = require( '../view-models/fdi-performance-win-progress' );

function getTabs( tabParam ){

	const isOverseasRegions = ( tabParam === 'os-regions' );
	const isUkRegions = !isOverseasRegions && ( tabParam === 'uk-regions' );
	const isSectors = !isOverseasRegions && !isUkRegions && true;

	return {
		isSectors,
		isOverseasRegions,
		isUkRegions
	};
}

module.exports = async function( req, res ){

	const tab = getTabs( req.query.tab );

	try {

		let data;
		let progressRows;
		let progressHeading;
		let progressColumnHeading;

		if( tab.isSectors ){

			data = await fdiService.getSectorsHomepageData( req );
			progressRows = performanceWinProgressViewModel.create( data.sectors.results );
			progressHeading = 'Sectors';
			progressColumnHeading = 'Sector';

		} else if( tab.isOverseasRegions ){

			data = await fdiService.getOverseasRegionsHomepageData( req );
			progressRows = performanceWinProgressViewModel.create( data.overseasRegions.results );
			progressHeading = 'Overseas markets';
			progressColumnHeading = 'Market';
		}

		res.render( 'investment/views/index', {

			dateRange: data.performance.date_range,
			headlines: performanceHeadlinesViewModel.create( data.performance.results ),
			details: performanceDetailsViewModel.create( data.performance.results ),
			progressRows,
			progressHeading,
			progressColumnHeading,
			tab
		} );

	} catch( e ){

		renderError.createHandler( req, res )( e );
	}
};
