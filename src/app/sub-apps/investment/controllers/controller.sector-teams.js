//const fdiService = require( '../../../lib/service/service.backend/investment/fdi' );
//const renderError = require( '../../../lib/render-error' );
//const sortProjects = require( '../lib/sort-projects' );
/*
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
			projects: sortProjects( data.results.investments, req.query.sort )
		} );

	} ).catch( renderError.createHandler( req, res ) );
}
*/
module.exports = {

/*
	hvcProjects: function( req, res ){

		renderProjects( req, res, 'investment/views/sector-teams/hvc-projects', fdiService.getSectorTeamHvcWinTable );
	},

	nonHvcProjects: function( req, res ){

		renderProjects( req, res, 'investment/views/sector-teams/non-hvc-projects', fdiService.getSectorTeamNonHvcWinTable );
	}
*/
};
