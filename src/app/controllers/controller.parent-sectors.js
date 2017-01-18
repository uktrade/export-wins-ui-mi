
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const sectorPerformanceDataSet = require( '../lib/data-sets/sector-performance' );
const topNonHvcDataSet = require( '../lib/data-sets/top-non-hvc' );
const sectorWinsDataSet = require( '../lib/data-sets/sector-wins' );
const targetProgressDataSet = require( '../lib/data-sets/target-progress' );
const hvcTargetPerformanceDataSet = require( '../lib/data-sets/hvc-target-performance' );

module.exports = {

	list: function( req, res ){

		backendService.getParentSectors( req.alice ).then( function( parentSectors ){

			//console.log( JSON.stringify( parentSectors, null, 2 ) );

			res.render( 'parent-sectors/list.html', { parentSectors } );

		} ).catch( renderError( res ) );
	},

	parent: function( req, res ){

		const parentId = req.params.id;

		backendService.getParentSectorInfo( req.alice, parentId ).then( function( data ){

			const winsData = data[ 0 ];
			const months = data[ 1 ];
			const topNonHvc = data[ 2 ];
			const	campaigns = data[ 3 ];

			res.render( 'sector/detail.html', {
				topNonHvc,
				topNonHvcScale: topNonHvcDataSet.create( topNonHvc ),
				sectorPerformance: sectorPerformanceDataSet.create( months ),
				winSummary: {
					target: winsData.hvcs.target,
					totalConfirmed: winsData.wins.hvc.value.confirmed,
					progress: targetProgressDataSet.create( winsData ),
					averageTimeToConfirm: winsData.avg_time_to_confirm,
					exportValue: winsData.exportValue,
					wins: sectorWinsDataSet.create( winsData )
				},
				sectorName: winsData.name,
				hvcTargetPerformance: hvcTargetPerformanceDataSet.create( campaigns )
			} );

		} ).catch( renderError( res ) );
	}
};
