
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const hvcTargetPerformance = require( '../lib/view-models/hvc-target-performance' );
const sectorSummary = require( '../lib/view-models/sector-summary' );
const hvcSummary = require( '../lib/view-models/sector-hvc-summary' );
const topMarkets = require( '../lib/view-models/top-markets' );
const monthlyPerformance = require( '../lib/view-models/monthly-performance' );

function getWins( view ){

	return function( req, res ){

		const teamId = req.params.id;

		backendService.getSectorTeamWinTable( req, teamId ).then( ( data ) => {

			res.render( view, {
				dateRange: data.date_range,
				sectorTeam: data.results.sector_team,
				wins: data.results.wins
			} );

		} ).catch( renderError.createHandler( res ) );
	};
}

module.exports = {

	overview: function( req, res ){

		backendService.getSectorTeamsOverview( req ).then( ( sectorTeams ) => {

			res.render( 'sector-teams/overview', {
				dateRange: sectorTeams.date_range,
				sectorTeams: sectorTeams.results
			} );

		} ).catch( renderError.createHandler( res ) );
	},

	list: function( req, res ){

		backendService.getSectorTeams( req ).then( ( sectorTeams ) => {

			res.render( 'sector-teams/list.html', { sectorTeams: sectorTeams.results } );

		} ).catch( renderError.createHandler( res ) );
	},

	team: function( req, res ){

		const teamId = req.params.id;

		backendService.getSectorTeamInfo( req, teamId ).then( ( data ) => {

			res.render( 'sector-teams/detail.html', {
				teamId,
				teamName: data.wins.results.name,
				sectorName: ( data.wins.results.name + ' Sector Team' ),
				summary: sectorSummary.create( data.wins ),
				hvcSummary: hvcSummary.create( data.wins ),
				hvcTargetPerformance: hvcTargetPerformance.create( data.campaigns ),
				monthlyPerformance: monthlyPerformance.create( data.months ),
				topMarkets: topMarkets.create( data.topNonHvc )
			} );

		} ).catch( renderError.createHandler( res ) );
	},

	wins: getWins( 'sector-teams/wins.html' ),
	nonHvcWins: getWins( 'sector-teams/non-hvc-wins.html' )
};
