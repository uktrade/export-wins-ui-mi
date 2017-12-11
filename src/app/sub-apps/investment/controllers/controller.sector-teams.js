const fdiService = require( '../../../lib/service/service.backend/investment/fdi' );
const renderError = require( '../../../lib/render-error' );
const fdiOverviewViewModel = require( '../view-models/fdi-overview' );
const fdiSectorTeamMarketsViewModel = require( '../view-models/fdi-sector-team-markets' );

function renderProjects( req, res, view, service ){

	const teamId = req.params.id;

	service( req, teamId ).then( function( data ){

		res.render( view, {
			dateRange: data.date_range,
			team: {
				id: teamId,
				name: data.results.name,
				description: data.results.description
			},
			projects: data.results.investments
		} );

	} ).catch( renderError.createHandler( req, res ) );
}

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

	hvcProjects: function( req, res ){

		renderProjects( req, res, 'investment/views/sector-teams/hvc-projects', fdiService.getSectorTeamHvcWinTable );
	},

	nonHvcProjects: function( req, res ){

		renderProjects( req, res, 'investment/views/sector-teams/non-hvc-projects', fdiService.getSectorTeamNonHvcWinTable );
	},
};
