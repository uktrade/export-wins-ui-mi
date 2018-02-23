const navMiddleware = require( '../../middleware/nav' );
const indexController = require( './controllers/controller.index' );
//const sectorTeamsController = require( './controllers/controller.sector-teams' );
const osRegionsController = require( './controllers/controller.overseas-regions' );
const ukRegionsController = require( './controllers/controller.uk-regions' );

const MOUNT_POINT = '/investment';

const nav = navMiddleware( { isInvestment: true } );

module.exports = function( router, user/*, isDev*/ ){

	//instead of mouting this router at /investment/
	//just add /investment to the routes
	//this means that req.url has the full path
	//which means that we have the correct path to redirect back to for login etc.

	function get( path, ...args ){

		//ensure the user and nav middleware gets run for each route
		router.get( ( MOUNT_POINT + path ), user, nav, ...args );
	}

	get( '/', indexController );

	//get( '/sector-teams/:id/hvc-projects/', sectorTeamsController.hvcProjects );
	//get( '/sector-teams/:id/non-hvc-projects/', sectorTeamsController.nonHvcProjects );

	get( '/overseas-regions/', osRegionsController.regions );
	get( '/overseas-regions/:id/', osRegionsController.region );
	get( '/overseas-regions/:id/hvc-performance/', osRegionsController.hvcPerformance );
	get( '/overseas-regions/:id/non-hvc-performance/', osRegionsController.nonHvcPerformance );
	get( '/overseas-regions/:id/hvc-projects/', osRegionsController.hvcProjects );
	get( '/overseas-regions/:id/non-hvc-projects/', osRegionsController.nonHvcProjects );

	get( '/uk-regions/', ukRegionsController.regions );
	get( '/uk-regions/:id/', ukRegionsController.region );
	get( '/uk-regions/:id/hvc-performance/', ukRegionsController.hvcPerformance );
	get( '/uk-regions/:id/non-hvc-performance/', ukRegionsController.nonHvcPerformance );
	get( '/uk-regions/:id/hvc-projects/', ukRegionsController.hvcProjects );
	get( '/uk-regions/:id/non-hvc-projects/', ukRegionsController.nonHvcProjects );

	return router;
};
