const indexController = require( './controllers/controller.index' );
const sectorTeamsController = require( './controllers/controller.sector-teams' );
const osRegionsController = require( './controllers/controller.overseas-regions' );
const ukRegionsController = require( './controllers/controller.uk-regions' );

module.exports = function( router/*, isDev*/ ){

	router.get( '/', indexController );

	router.get( '/sector-teams/', sectorTeamsController.sectorTeams );
	router.get( '/sector-teams/:id/', sectorTeamsController.sectorTeam );
	router.get( '/sector-teams/:id/hvc-performance/', sectorTeamsController.hvcPerformance );
	router.get( '/sector-teams/:id/non-hvc-performance/', sectorTeamsController.nonHvcPerformance );
	router.get( '/sector-teams/:id/wins/', sectorTeamsController.wins );
	router.get( '/sector-teams/:id/non-hvc-wins/', sectorTeamsController.nonHvcWins );

	router.get( '/overseas-regions/', osRegionsController.regions );
	router.get( '/overseas-regions/:id/', osRegionsController.region );
	router.get( '/overseas-regions/:id/hvc-performance/', osRegionsController.hvcPerformance );
	router.get( '/overseas-regions/:id/non-hvc-performance/', osRegionsController.nonHvcPerformance );
	router.get( '/overseas-regions/:id/wins/', osRegionsController.wins );
	router.get( '/overseas-regions/:id/non-hvc-wins/', osRegionsController.nonHvcWins );

	router.get( '/uk-regions/', ukRegionsController.regions );
	router.get( '/uk-regions/:id/', ukRegionsController.region );
	router.get( '/uk-regions/:id/hvc-performance/', ukRegionsController.hvcPerformance );
	router.get( '/uk-regions/:id/non-hvc-performance/', ukRegionsController.nonHvcPerformance );
	router.get( '/uk-regions/:id/wins/', ukRegionsController.wins );
	router.get( '/uk-regions/:id/non-hvc-wins/', ukRegionsController.nonHvcWins );

	return router;
};
