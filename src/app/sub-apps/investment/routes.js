const indexController = require( './controllers/controller.index' );
const sectorTeamsController = require( './controllers/controller.sector-teams' );

module.exports = function( router/*, isDev*/ ){

	router.get( '/', indexController );
	router.get( '/sector-teams/', sectorTeamsController.sectorTeams );
	router.get( '/sector-teams/:id/', sectorTeamsController.sectorTeam );

	return router;
};
