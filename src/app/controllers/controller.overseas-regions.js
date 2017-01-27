
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const sectorPerformanceDataSet = require( '../lib/data-sets/sector-performance' );
const sectorWinsDataSet = require( '../lib/data-sets/sector-wins' );
const topNonHvcDataSet = require( '../lib/data-sets/top-non-hvc' );
const targetProgressDataSet = require( '../lib/data-sets/target-progress' );
const hvcTargetPerformanceDataSet = require( '../lib/data-sets/hvc-target-performance' );

module.exports = { 

	overview: function( req, res ){

		backendService.getOverseasRegionsOverview( req.alice ).then( ( regionGroups ) => {

			//console.log( JSON.stringify( regionGroups, null, 2 ) );

			res.render( 'overseas-regions/overview.html', { regionGroups } );
		
		} ).catch( renderError.handler( res ) );
	},

	list: function( req, res ){

		backendService.getOverseasRegions( req.alice ).then( ( regions ) => {

			res.render( 'overseas-regions/list.html', { regions } );
		
		} ).catch( renderError.handler( res ) );
	},

	region: function( req, res ){

		const regionId = req.params.id;

		backendService.getOverseasRegionInfo( req.alice, regionId ).then( ( data ) => {

			const winsData = data[ 0 ];
			const months = data[ 1 ];
			const topNonHvc = data[ 2 ];
			const hvcTargetPerformance = data[ 3 ];

			res.render( 'overseas-regions/detail.html', {
				
				regionName: winsData.name,
				winSummary: {
					target: winsData.hvcs.target,
					totalConfirmed: winsData.wins.hvc.value.confirmed,
					progress: targetProgressDataSet.create( winsData ),
					averageTimeToConfirm: winsData.avg_time_to_confirm,
					exportValue: winsData.exportValue,
					wins: sectorWinsDataSet.create( winsData )
				},
				hvcTargetPerformance: hvcTargetPerformanceDataSet.create( hvcTargetPerformance ),
				sectorPerformance: sectorPerformanceDataSet.create( months ),
				topNonHvc,
				topNonHvcScale: topNonHvcDataSet.create( topNonHvc ),
			} );

		} ).catch( renderError.handler( res ) );
	}
};
