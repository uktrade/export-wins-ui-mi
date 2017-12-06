const fdiService = require( '../../../lib/service/service.backend/investment/fdi' );
const renderError = require( '../../../lib/render-error' );
const fdiOverviewViewModel = require( '../view-models/fdi-overview' );
const fdiSectorTeamMarketsViewModel = require( '../view-models/fdi-sector-team-markets' );

module.exports = {

	sectorTeams: function( req, res ){

		fdiService.getSectorTeamsOverview( req ).then( ( data ) => {

			res.render( 'investment/views/sector-teams/overview', {
				teams: data,
				overview: fdiOverviewViewModel.create( data.results.overview ),
				markets: fdiSectorTeamMarketsViewModel.create( data.results.sector_teams )
			} );

		} ).catch( renderError.createHandler( req, res ) );
	},

	sectorTeam: function( req, res ){

		const teamId = req.params.id;

		fdiService.getSectorTeam( req, teamId ).then( ( data ) => {

			res.render( 'investment/views/sector-teams/detail', {
				dateRange: data.date_range,
				teamId,
				team: data.results,
				overview: fdiOverviewViewModel.create( data.results.overview ),
				markets: fdiSectorTeamMarketsViewModel.create( data.results.markets )
			} );

		} ).catch( renderError.createHandler( req, res ) );
	},

	hvcPerformance: function( req, res ){

		const teamId = req.params.id;

		fdiService.getSectorTeamHvc( req, teamId ).then( ( data ) => {

			res.render( 'investment/views/sector-teams/hvc-performance', {
				dateRange: data.date_range,
				teamId,
				team: data.results,
				overview: fdiOverviewViewModel.create( data.results.overview ),
				markets: fdiSectorTeamMarketsViewModel.create( data.results.markets )
			} );

		} ).catch( renderError.createHandler( req, res ) );
	},

	nonHvcPerformance: function( req, res ){

		const teamId = req.params.id;

		fdiService.getSectorTeamNonHvc( req, teamId ).then( ( data ) => {

			res.render( 'investment/views/sector-teams/non-hvc-performance', {
				dateRange: data.date_range,
				teamId,
				team: data.results,
				overview: fdiOverviewViewModel.create( data.results.overview ),
				markets: fdiSectorTeamMarketsViewModel.create( data.results.markets )
			} );

		} ).catch( renderError.createHandler( req, res ) );
	},

	wins: function( req, res ){

		const teamId = req.params.id;

		fdiService.getSectorTeam( req, teamId ).then( ( data ) => {

			res.render( 'investment/views/sector-teams/wins', {
				dateRange: data.date_range,
				teamId,
				team: data.results
			} );

		} ).catch( renderError.createHandler( req, res ) );
	},

	nonHvcWins: function( req, res ){

		const teamId = req.params.id;

		fdiService.getSectorTeam( req, teamId ).then( ( data ) => {

			res.render( 'investment/views/sector-teams/non-hvc-wins', {
				dateRange: data.date_range,
				teamId,
				team: data.results
			} );

		} ).catch( renderError.createHandler( req, res ) );
	},
};
