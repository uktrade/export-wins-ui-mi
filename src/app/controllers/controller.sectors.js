
const backendService = require( '../lib/service/service.backend' );
const sectorDataSet = require( '../lib/data-sets/sector-performance' );
const winsDataSet = require( '../lib/data-sets/wins' );
const topNonHvcDataSet = require( '../lib/data-sets/top-non-hvc' );
const targetProgressDataSet = require( '../lib/data-sets/target-progress' );
const hvcTargetPerformanceDataSet = require( '../lib/data-sets/hvc-target-performance' );

// .toLocaleString( 'en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }

module.exports = {

	sectorList: function( req, res ){

		backendService.getSectors().then( function( sectors ){

			res.render( 'sector-list.html', { sectors } );

		} ).catch( function( err ){

			res.render( 'error', { error: err } );
		} );
	},

	sector: function( req, res ){

		const sectorId = req.params.id;

		backendService.getSectorInfo( sectorId ).then( function( data ){

			const winsData = data[ 0 ];
			const sectorMonths = data[ 1 ];
			const topNonHvcRegionsSectors = data[ 2 ];
			const hvcTargetPerformance = data[ 3 ];

			res.render( 'sector.html', {
				
				topNonHvcRegionsSectors,
				topNonHvcRegionsSectorsScale: topNonHvcDataSet.create( topNonHvcRegionsSectors ),
				sectorPerformance: sectorDataSet.create( sectorMonths ),
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

			res.render( 'error', { error: err } );
		} );
	}
};
