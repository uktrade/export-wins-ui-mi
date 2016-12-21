
const backendService = require( '../lib/service/service.backend' );

const sectorDataSet = require( '../lib/data-sets/sector-performance' );
const winsDataSet = require( '../lib/data-sets/wins' );
const topNonHvcDataSet = require( '../lib/data-sets/top-non-hvc' );
const targetProgressDataSet = require( '../lib/data-sets/target-progress' );
const hvcTargetPerformanceDataSet = require( '../lib/data-sets/hvc-target-performance' );

module.exports = { 

	overview: function( req, res ){

		res.render( 'regions/overview.html' );
	},

	regionList: function( req, res ){

		backendService.getRegions().then( ( regions ) => {

			res.render( 'regions/list.html', { regions } );
		} );
	},

	region: function( req, res ){

		const regionId = req.params.id;

		backendService.getRegionInfo( regionId ).then( function( data ){

			const regionName = data[ 0 ];
			const winsData = data[ 1 ];
			const months = data[ 2 ];
			const topNonHvc = data[ 3 ];
			const hvcTargetPerformance = data[ 4 ];

			res.render( 'regions/region.html', {
				
				regionName,
				topNonHvcRegionsSectors: topNonHvc,
				topNonHvcRegionsSectorsScale: topNonHvcDataSet.create( topNonHvc ),
				sectorPerformance: sectorDataSet.create( months ),
				wins: winsDataSet.create( winsData ),
				winSummary: {
					target: winsData.hvcs.target,
					totalConfirmed: winsData.wins.hvc.value.confirmed,
					progress: targetProgressDataSet.create( winsData ),
					averageTimeToConfirm: winsData.avg_time_to_confirm
				},
				sectorName: winsData.name,
				hvcTargetPerformance: hvcTargetPerformanceDataSet.create( hvcTargetPerformance )
			} );

		} ).catch( function( err ){

			console.error( err );

			res.render( 'error', { error: err } );
		} );
	}
};
