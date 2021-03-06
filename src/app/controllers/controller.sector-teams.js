
const exportBackendService = require( '../lib/service/service.backend' ).export;
const analyticsService = require( '../lib/service/analytics' );
const renderError = require( '../lib/render-error' );
const sortWins = require( '../lib/sort-wins' );

const hvcTargetPerformance = require( '../lib/view-models/hvc-target-performance' );
const sectorSummary = require( '../lib/view-models/sector-summary' );
const hvcSummary = require( '../lib/view-models/sector-hvc-summary' );
const topMarkets = require( '../lib/view-models/top-markets' );
const monthlyPerformance = require( '../lib/view-models/monthly-performance' );

function getWins( view, type ){

	return function( req, res ){

		const teamId = req.params.id;

		exportBackendService.getSectorTeamWinTable( req, teamId ).then( ( data ) => {

			res.render( view, {
				dateRange: data.date_range,
				sectorTeam: data.results.sector_team,
				wins: sortWins( data.results.wins[ type ], req.query.sort )
			} );

		} ).catch( renderError.createHandler( req, res ) );
	};
}

module.exports = {

	overview: function( req, res ){

		exportBackendService.getSectorTeamsOverview( req ).then( ( sectorTeams ) => {

			res.render( 'sector-teams/overview', {
				dateRange: sectorTeams.date_range,
				sectorTeams: sectorTeams.results
			} );

		} ).catch( renderError.createHandler( req, res ) );
	},

	topNonHvcs: function( req, res ){

		const teamId = req.params.id;

		exportBackendService.getSectorTeamTopNonHvc( req, teamId, true ).then( ( topNonHvcs ) => {

			res.render( 'partials/top-non-hvcs.html', { topNonHvcs: topNonHvcs.results } );

			const tracker = analyticsService.createTracker( req );

			tracker && tracker.loadAllTopMarkets( req.url, 'Export Sector Team', teamId );

		} ).catch( renderError.createHandler( req, res ) );
	},

	team: function( req, res ){

		const teamId = req.params.id;

		exportBackendService.getSectorTeamInfo( req, teamId ).then( ( data ) => {

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

		} ).catch( renderError.createHandler( req, res ) );
	},

	wins: getWins( 'sector-teams/wins.html', 'hvc' ),
	nonHvcWins: getWins( 'sector-teams/non-hvc-wins.html', 'non_hvc' )
};
