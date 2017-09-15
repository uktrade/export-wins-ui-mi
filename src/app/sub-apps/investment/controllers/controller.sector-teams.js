const investmentService = require( '../../../lib/service/service.backend/investment' );
const renderError = require( '../../../lib/render-error' );

module.exports = {

	sectorTeams: function( req, res ){

		investmentService.getSectorTeams( req ).then( ( data ) => {

			res.render( 'investment/views/sector-teams/overview', { sectorTeams: data } );

		} ).catch( renderError.createHandler( res ) );
	},

	sectorTeam: function( req, res ){

		const teamId = req.params.id;

		investmentService.getSectorTeam( req, teamId ).then( ( data ) => {

			res.render( 'investment/views/sector-teams/detail', { dateRange: data.date_range, team: data.results } );

		} ).catch( renderError.createHandler( res ) );
	},

	hvcPerformance: function( req, res ){

		const teamId = req.params.id;

		investmentService.getSectorTeam( req, teamId ).then( ( data ) => {

			res.render( 'investment/views/sector-teams/hvc-performance', { dateRange: data.date_range, team: data.results } );

		} ).catch( renderError.createHandler( res ) );
	},

	nonHvcPerformance: function( req, res ){

		const teamId = req.params.id;

		investmentService.getSectorTeam( req, teamId ).then( ( data ) => {

			res.render( 'investment/views/sector-teams/non-hvc-performance', { dateRange: data.date_range, team: data.results } );

		} ).catch( renderError.createHandler( res ) );
	},

	wins: function( req, res ){

		const teamId = req.params.id;

		investmentService.getSectorTeam( req, teamId ).then( ( data ) => {

			res.render( 'investment/views/sector-teams/wins', { dateRange: data.date_range, team: data.results } );

		} ).catch( renderError.createHandler( res ) );
	},

	nonHvcWins: function( req, res ){

		const teamId = req.params.id;

		investmentService.getSectorTeam( req, teamId ).then( ( data ) => {

			res.render( 'investment/views/sector-teams/non-hvc-wins', { dateRange: data.date_range, team: data.results } );

		} ).catch( renderError.createHandler( res ) );
	},
};
