const exportBackendService = require( '../lib/service/service.backend' ).export;
const errorHandler = require( '../lib/render-error' );
const sortWins = require( '../lib/sort-wins' );

const regionSummary = require( '../lib/view-models/uk-region-summary' );
const regionPerformance = require( '../lib/view-models/uk-region-performance' );
const overviewSummary = require( '../lib/view-models/uk-regions-overview-summary' );
const overviewRegions = require( '../lib/view-models/uk-regions-overview-regions' );
const topMarkets = require( '../lib/view-models/top-markets' );
const monthlyPerformance = require( '../lib/view-models/monthly-performance' );

function getWins( view, type ){

	return function( req, res ){

		const regionId = req.params.id;

		exportBackendService.getUkRegionWinTable( req, regionId ).then( ( data ) => {

			res.render( view, {
				dateRange: data.date_range,
				region: data.results.uk_region,
				wins: sortWins( data.results.wins[ type ], req.query.sort )
			} );

		} ).catch( errorHandler.createHandler( req, res ) );
	};
}

module.exports = {

	overview: function( req, res ){

		exportBackendService.getUkRegionsOverview( req ).then( ( overview ) => {

			res.render( 'uk-regions/overview.html', {
				summary: overviewSummary.create( overview.date_range, overview.results.summary ),
				regionGroups: overviewRegions.create( overview.date_range, overview.results.region_groups )
			} );

		} ).catch( errorHandler.createHandler( req, res ) );
	},

	region: function( req, res ){

		const regionId = req.params.id;

		exportBackendService.getUkRegionInfo( req, regionId ).then( ( data ) => {

			res.render( 'uk-regions/detail.html', {
				regionId,
				regionName: data.wins.results.name,
				dateRange: data.wins.date_range,
				summary: regionSummary.create( data.wins ),
				performance: regionPerformance.create( data.wins ),
				topMarkets: topMarkets.create( data.topNonHvc ),
				monthlyPerformance: monthlyPerformance.create( data.months )
			} );

		} ).catch( errorHandler.createHandler( req, res ) );
	},

	wins: getWins( 'uk-regions/wins.html', 'hvc' ),
	nonHvcWins: getWins( 'uk-regions/non-hvc-wins.html', 'non_hvc' )
};
