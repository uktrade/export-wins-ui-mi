
const backendService = require( '../lib/service/service.backend' );

const sectorDataSet = require( '../lib/data-sets/sector-performance' );
const winsDataSet = require( '../lib/data-sets/wins' );
const topNonHvcDataSet = require( '../lib/data-sets/top-non-hvc' );
const targetProgressDataSet = require( '../lib/data-sets/target-progress' );
const hvcTargetPerformanceDataSet = require( '../lib/data-sets/hvc-target-performance' );

module.exports = { 

	region: function( req, res ){

		backendService.getRegionInfo( 4 ).then( function( data ){

			const winsData = data[ 0 ];
			const months = data[ 1 ];
			const topNonHvc = data[ 2 ];
			const hvcTargetPerformance = data[ 3 ];

			res.render( 'region.html', {
				
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
