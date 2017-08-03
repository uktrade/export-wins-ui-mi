
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const hvcTargetPerformance = require( '../lib/view-models/hvc-target-performance' );
const sectorSummary = require( '../lib/view-models/sector-summary' );
const hvcSummary = require( '../lib/view-models/sector-hvc-summary' );
const topMarkets = require( '../lib/view-models/top-markets' );
const monthlyPerformance = require( '../lib/view-models/monthly-performance' );

function getWins( view ){

	return function( req, res ){

		const regionId = req.params.id;

		backendService.getOverseasRegionWinTable( req, regionId ).then( ( data ) => {

			res.render( view, {
				dateRange: data.date_range,
				region: data.results.os_region,
				wins: data.results.wins
			} );

		} ).catch( renderError.createHandler( res ) );
	};
}

module.exports = {

	overview: function( req, res ){

		backendService.getOverseasRegionsOverviewGroups( req ).then( ( regionGroups ) => {

			res.render( 'overseas-regions/overview.html', {
				dateRange: regionGroups.date_range,
				regionGroups: regionGroups.results
			} );

		} ).catch( renderError.createHandler( res ) );
	},

	list: function( req, res ){

		backendService.getOverseasRegions( req ).then( ( regions ) => {

			res.render( 'overseas-regions/list.html', { regions: regions.results } );

		} ).catch( renderError.createHandler( res ) );
	},

	region: function( req, res ){

		const regionId = req.params.id;

		backendService.getOverseasRegionInfo( req, regionId ).then( ( data ) => {

			res.render( 'overseas-regions/detail.html', {
				regionId,
				regionName: data.wins.results.name,
				summary: sectorSummary.create( data.wins ),
				hvcSummary: hvcSummary.create( data.wins ),
				hvcTargetPerformance: hvcTargetPerformance.create( data.campaigns ),
				monthlyPerformance: monthlyPerformance.create( data.months ),
				topMarkets: topMarkets.create( data.topNonHvc ),
			} );

		} ).catch( renderError.createHandler( res ) );
	},

	wins: getWins( 'overseas-regions/wins.html' ),
	nonHvcWins: getWins( 'overseas-regions/non-hvc-wins.html' )
};
