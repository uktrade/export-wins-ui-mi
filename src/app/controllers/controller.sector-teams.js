
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const sectorPerformanceDataSet = require( '../lib/data-sets/sector-performance' );
const topNonHvcDataSet = require( '../lib/data-sets/top-non-hvc' );
const sectorWinsDataSet = require( '../lib/data-sets/sector-wins' );
const targetProgressDataSet = require( '../lib/data-sets/target-progress' );
const hvcTargetPerformanceDataSet = require( '../lib/data-sets/hvc-target-performance' );

// .toLocaleString( 'en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }

module.exports = {

	overview: function( req, res ){

		backendService.getSectorTeamsOverview( req.alice ).then( ( sectorTeams ) => {
			
			res.render( 'sector-teams/overview', { sectorTeams } );
			
		} ).catch( renderError( res ) );
	},

	list: function( req, res ){

		backendService.getSectorTeams( req.alice ).then( function( sectorTeams ){

			res.render( 'sector-teams/list.html', { sectorTeams } );

		} ).catch( renderError( res ) );
	},

	team: function( req, res ){

		const teamId = req.params.id;

		backendService.getSectorTeamInfo( req.alice, teamId ).then( function( data ){

			const winsData = data[ 0 ];
			const months = data[ 1 ];
			const topNonHvc = data[ 2 ];
			const campaigns = data[ 3 ];

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
