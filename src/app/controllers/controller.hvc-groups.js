
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const sectorPerformanceDataSet = require( '../lib/data-sets/sector-performance' );
const sectorWinsDataSet = require( '../lib/data-sets/sector-wins' );
const targetProgressDataSet = require( '../lib/data-sets/target-progress' );
const hvcTargetPerformanceDataSet = require( '../lib/data-sets/hvc-target-performance' );

module.exports = {

	list: function( req, res ){

		backendService.getHvcGroups( req.alice ).then( ( hvcGroups ) => {

			//console.log( JSON.stringify( hvcGroups, null, 2 ) );

			res.render( 'hvc-groups/list.html', { hvcGroups } );

		} ).catch( renderError.createHandler( res ) );
	},

	group: function( req, res ){

		const groupId = req.params.id;

		backendService.getHvcGroupInfo( req.alice, groupId ).then( ( data ) => {

			const winsData = data[ 0 ];
			const months = data[ 1 ];
			const	campaigns = data[ 2 ];

			res.render( 'hvc-groups/detail.html', {
				sectorPerformance: sectorPerformanceDataSet.create( months ),
				winSummary: {
					target: winsData.hvcs.target,
					totalConfirmed: winsData.wins.export.hvc.value.confirmed,
					totalUnconfirmed: winsData.wins.export.hvc.value.unconfirmed,
					progress: targetProgressDataSet.create( winsData ),
					averageTimeToConfirm: winsData.avg_time_to_confirm,
					exportValue: winsData.exportValue,
					wins: sectorWinsDataSet.create( winsData )
				},
				sectorName: winsData.name,
				hvcTargetPerformance: hvcTargetPerformanceDataSet.create( campaigns )
			} );

		} ).catch( renderError.createHandler( res ) );
	}
};
