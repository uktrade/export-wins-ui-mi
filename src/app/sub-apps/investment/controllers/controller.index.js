const fdiService = require( '../../../lib/service/service.backend/investment/fdi' );
const renderError = require( '../../../lib/render-error' );
const sortSectorProgress = require( '../lib/sort-sector-progress' );
const sortMarketProgress = require( '../lib/sort-market-progress' );
const performanceHeadlinesViewModel = require( '../view-models/fdi-performance-headlines' );
const performanceDetailsViewModel = require( '../view-models/fdi-performance-details' );
const performanceWinProgressViewModel = require( '../view-models/fdi-performance-win-progress' );

const tabValues = {
	overseasRegions: 'os-regions',
	ukRegions: 'uk-regions'
};

function getTabs( tabParam ){

	let isSectors = false;
	let isOverseasRegions = false;
	let isUkRegions = false;
	let selected;

	if( tabParam === tabValues.overseasRegions ) {

		isOverseasRegions = true;
		selected = tabValues.overseasRegions;

	} else if( !isOverseasRegions && ( tabParam === tabValues.ukRegions ) ){

		isUkRegions = true;
		selected = tabValues.ukRegions;

	} else {

		isSectors = true;
	}

	return {
		isSectors,
		isOverseasRegions,
		isUkRegions,
		selected
	};
}

module.exports = async function( req, res ){

	const tab = getTabs( req.query.tab );

	try {

		let data;
		let sortRows;
		let progressRows;
		let progressHeading;
		let progressColumnHeading;
		let progressColumnHeadingKey;

		if( tab.isSectors ){

			data = await fdiService.getSectorsHomepageData( req );
			sortRows = sortSectorProgress;
			progressRows = data.sectors.results;
			progressHeading = 'Sectors';
			progressColumnHeading = 'Sector';
			progressColumnHeadingKey = sortSectorProgress.KEYS.sector;

		} else if( tab.isOverseasRegions ){

			data = await fdiService.getOverseasRegionsHomepageData( req );
			sortRows = sortMarketProgress;
			progressRows = data.overseasRegions.results;
			progressHeading = 'Overseas markets';
			progressColumnHeading = 'Market';
			progressColumnHeadingKey = sortMarketProgress.KEYS.market;
		}

		res.render( 'investment/views/index', {

			dateRange: data.performance.date_range,
			headlines: performanceHeadlinesViewModel.create( data.performance.results ),
			details: performanceDetailsViewModel.create( data.performance.results ),
			progressRows: sortRows( performanceWinProgressViewModel.create( progressRows ), req.query.sort ),
			sortKeys: sortRows.KEYS,
			progressHeading,
			progressColumnHeading,
			progressColumnHeadingKey,
			tab
		} );

	} catch( e ){

		renderError.createHandler( req, res )( e );
	}
};
