
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const sectorPerformanceDataSet = require( '../lib/data-sets/sector-performance' );

const hvcTargetPerformance = require( '../lib/view-models/hvc-target-performance' );
const sectorSummary = require( '../lib/view-models/sector-summary' );
const hvcSummary = require( '../lib/view-models/sector-hvc-summary' );
const topMarkets = require( '../lib/view-models/top-markets' );

module.exports = {

	overview: function( req, res ){

		backendService.getSectorTeamsOverview( req.alice ).then( ( sectorTeams ) => {
			
			res.render( 'sector-teams/overview', { sectorTeams } );
			
		} ).catch( renderError.createHandler( res ) );
	},

	list: function( req, res ){

		backendService.getSectorTeams( req.alice ).then( ( sectorTeams ) => {

			res.render( 'sector-teams/list.html', { sectorTeams } );

		} ).catch( renderError.createHandler( res ) );
	},

	team: function( req, res ){

		const teamId = req.params.id;

		backendService.getSectorTeamInfo( req.alice, teamId ).then( ( data ) => {

			res.render( 'sector-teams/detail.html', {
				
				sectorName: ( data.wins.name + ' Sector Team' ),
				summary: sectorSummary.create( data.wins ),
				hvcSummary: hvcSummary.create( data.wins ),
				hvcTargetPerformance: hvcTargetPerformance.create( data.campaigns ),
				sectorPerformance: sectorPerformanceDataSet.create( data.months ),
				topMarkets: topMarkets.create( data.topNonHvc )
			} );

		} ).catch( renderError.createHandler( res ) );
	}
};
