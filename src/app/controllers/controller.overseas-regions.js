
const exportBackendService = require( '../lib/service/service.backend' ).export;
const analyticsService = require( '../lib/service/analytics' );
const renderError = require( '../lib/render-error' );
const sortWins = require( '../lib/sort-wins' );

const hvcTargetPerformance = require( '../lib/view-models/hvc-target-performance' );
const sectorSummary = require( '../lib/view-models/sector-summary' );
const hvcSummary = require( '../lib/view-models/sector-hvc-summary' );
const topMarkets = require( '../lib/view-models/top-markets' );
const monthlyPerformance = require( '../lib/view-models/monthly-performance' );

function getWins( view, type ){

	return function( req, res ){

		const regionId = req.params.id;

		exportBackendService.getOverseasRegionWinTable( req, regionId ).then( ( data ) => {

			res.render( view, {
				dateRange: data.date_range,
				region: data.results.os_region,
				wins: sortWins( data.results.wins[ type ], req.query.sort )
			} );

		} ).catch( renderError.createHandler( req, res ) );
	};
}

module.exports = {

	overview: function( req, res ){

		exportBackendService.getOverseasRegionsOverviewGroups( req ).then( ( regionGroups ) => {

			res.render( 'overseas-regions/overview.html', {
				dateRange: regionGroups.date_range,
				regionGroups: regionGroups.results
			} );

		} ).catch( renderError.createHandler( req, res ) );
	},

	topNonHvcs: function( req, res ){

		const regionId = req.params.id;

		exportBackendService.getOverseasRegionTopNonHvc( req, regionId, true ).then( ( topNonHvcs ) => {

			res.render( 'partials/top-non-hvcs.html', { topNonHvcs: topNonHvcs.results } );

			const tracker = analyticsService.createTracker( req );

			tracker && tracker.loadAllTopMarkets( req.url, 'Export Overseas Region', regionId );

		} ).catch( renderError.createHandler( req, res ) );
	},

	region: function( req, res ){

		const regionId = req.params.id;

		exportBackendService.getOverseasRegionInfo( req, regionId ).then( ( data ) => {

			res.render( 'overseas-regions/detail.html', {
				regionId,
				regionName: data.wins.results.name,
				summary: sectorSummary.create( data.wins ),
				hvcSummary: hvcSummary.create( data.wins ),
				hvcTargetPerformance: hvcTargetPerformance.create( data.campaigns ),
				monthlyPerformance: monthlyPerformance.create( data.months ),
				topMarkets: topMarkets.create( data.topNonHvc ),
			} );

		} ).catch( renderError.createHandler( req, res ) );
	},

	wins: getWins( 'overseas-regions/wins.html', 'hvc' ),
	nonHvcWins: getWins( 'overseas-regions/non-hvc-wins.html', 'non_hvc' )
};
