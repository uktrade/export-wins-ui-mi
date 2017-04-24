
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const hvcTargetPerformance = require( '../lib/view-models/hvc-target-performance' );
const sectorSummary = require( '../lib/view-models/sector-summary' );
const hvcSummary = require( '../lib/view-models/sector-hvc-summary' );
const topMarkets = require( '../lib/view-models/top-markets' );
const monthlyPerformance = require( '../lib/view-models/monthly-performance' );

module.exports = {

	overview: function( req, res ){

		backendService.getOverseasRegionsOverview( req.alice, req.year ).then( ( regionGroups ) => {

			res.render( 'overseas-regions/overview.html', {
				dateRange: regionGroups.date_range,
				regionGroups: regionGroups.results
			} );

		} ).catch( renderError.createHandler( res ) );
	},

	list: function( req, res ){

		backendService.getOverseasRegions( req.alice, req.year ).then( ( regions ) => {

			res.render( 'overseas-regions/list.html', { regions: regions.results } );

		} ).catch( renderError.createHandler( res ) );
	},

	region: function( req, res ){

		const regionId = req.params.id;

		backendService.getOverseasRegionInfo( req.alice, req.year, regionId ).then( ( data ) => {

			res.render( 'overseas-regions/detail.html', {

				regionName: data.wins.results.name,
				summary: sectorSummary.create( data.wins ),
				hvcSummary: hvcSummary.create( data.wins ),
				hvcTargetPerformance: hvcTargetPerformance.create( data.campaigns ),
				monthlyPerformance: monthlyPerformance.create( data.months ),
				topMarkets: topMarkets.create( data.topNonHvc ),
			} );

		} ).catch( renderError.createHandler( res ) );
	}
};
