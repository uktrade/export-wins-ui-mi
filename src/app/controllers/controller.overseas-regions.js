
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const sectorPerformanceDataSet = require( '../lib/data-sets/sector-performance' );
const topNonHvcDataSet = require( '../lib/data-sets/top-non-hvc' );

const hvcTargetPerformance = require( '../lib/view-models/hvc-target-performance' );
const sectorSummary = require( '../lib/view-models/sector-summary' );
const hvcSummary = require( '../lib/view-models/sector-hvc-summary' );

module.exports = { 

	overview: function( req, res ){

		backendService.getOverseasRegionsOverview( req.alice ).then( ( regionGroups ) => {

			res.render( 'overseas-regions/overview.html', { regionGroups } );
		
		} ).catch( renderError.createHandler( res ) );
	},

	list: function( req, res ){

		backendService.getOverseasRegions( req.alice ).then( ( regions ) => {

			res.render( 'overseas-regions/list.html', { regions } );
		
		} ).catch( renderError.createHandler( res ) );
	},

	region: function( req, res ){

		const regionId = req.params.id;

		backendService.getOverseasRegionInfo( req.alice, regionId ).then( ( data ) => {

			res.render( 'overseas-regions/detail.html', {
				
				regionName: data.wins.name,
				summary: sectorSummary.create( data.wins ),
				hvcSummary: hvcSummary.create( data.wins ),
				hvcTargetPerformance: hvcTargetPerformance.create( data.campaigns ),
				sectorPerformance: sectorPerformanceDataSet.create( data.months ),
				topNonHvc: data.topNonHvc,
				topNonHvcScale: topNonHvcDataSet.create( data.topNonHvc ),
			} );

		} ).catch( renderError.createHandler( res ) );
	}
};
