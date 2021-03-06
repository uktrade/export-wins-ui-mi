const config = require( '../../../config' );
const fdiService = require( '../../../lib/service/service.backend/investment/fdi' );
const renderError = require( '../../../lib/render-error' );
const sortSectorProgress = require( '../lib/sort-sector-progress' );
const sortMarketProgress = require( '../lib/sort-market-progress' );
const sortRegionProgress = require( '../lib/sort-region-progress' );
const performanceHeadlinesViewModel = require( '../view-models/fdi-performance-headlines' );
const performanceDetailsViewModel = require( '../view-models/fdi-performance-details' );
const performanceWinProgressViewModel = require( '../view-models/fdi-performance-win-progress' );
const regionProgressViewModel = require( '../view-models/fdi-performance-region-progress' );

const tabValues = {
	overseasRegions: 'os-regions',
	ukRegions: 'uk-regions'
};

function getTabs( tabParam, hasExperiments ){

	let isSectors = false;
	let isOverseasRegions = false;
	let isUkRegions = false;
	let selected;

	if( tabParam === tabValues.overseasRegions ) {

		isOverseasRegions = true;
		selected = tabValues.overseasRegions;

	} else if( !isOverseasRegions && ( hasExperiments && tabParam === tabValues.ukRegions ) ){

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

	const tab = getTabs( req.query.tab, req.user.experiments );

	try {

		let data;
		let progressRows;
		let progressHeading;
		let viewData = {};

		if( tab.isUkRegions ){

			data = await fdiService.getUkRegionsHomepageData( req );
			viewData = {
				progressRows: regionProgressViewModel.create( sortRegionProgress( data.ukRegions.results, req.query.sort ) ),
				progressHeading: 'UK regions',
				sortKeys: sortRegionProgress.KEYS
			};

		} else {

			let sortRows;
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

			viewData = {

				sortKeys: sortRows.KEYS,
				progressRows: sortRows( performanceWinProgressViewModel.create( progressRows ), req.query.sort ),
				progressHeading,
				progressColumnHeading,
				progressColumnHeadingKey
			};
		}

		res.render( 'investment/views/index', Object.assign( {

			dateRange: data.performance.date_range,
			headlines: performanceHeadlinesViewModel.create( data.performance.results ),
			details: performanceDetailsViewModel.create( data.performance.results ),
			tab,
			workspaceUrls: config.urls.dataWorkspace,
		}, viewData ) );

	} catch( e ){

		renderError.createHandler( req, res )( e );
	}
};
