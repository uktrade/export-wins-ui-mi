const config = require( './config' );

const indexController = require( './controllers/controller.index' );
const sectorTeamController = require( './controllers/controller.sector-teams' );
const regionController = require( './controllers/controller.overseas-regions' );
const hvcGroupController = require( './controllers/controller.hvc-groups' );
const winController =  require( './controllers/controller.win' );
const hvcController = require( './controllers/controller.hvc' );

const createUserMiddleware = require( './lib/middleware/user' );
const dateRange = require( './lib/middleware/date-range' );

module.exports = function( express, app, isDev ){

	const user = createUserMiddleware( isDev );

	app.use( dateRange );

	app.get( '/', user, indexController );

	app.get( '/sector-teams/', user, sectorTeamController.list );
	app.get( '/sector-teams/overview/', user, sectorTeamController.overview );
	app.get( '/sector-teams/:id', user, sectorTeamController.team );
	app.get( '/sector-teams/:id/wins/', user, sectorTeamController.wins );

	app.get( '/overseas-regions/', user, regionController.list );
	app.get( '/overseas-regions/overview/', user, regionController.overview );
	app.get( '/overseas-regions/:id', user, regionController.region );
	app.get( '/overseas-regions/:id/wins/', user, regionController.wins );

	app.get( '/hvc/:id', user, hvcController.hvc );
	app.get( '/hvc/:id/wins', user, hvcController.winList );

	app.get( '/hvc-groups/', user, hvcGroupController.list );
	app.get( '/hvc-groups/:id', user, hvcGroupController.group );
	app.get( '/hvc-groups/:id/wins', user, hvcGroupController.wins );

	if( config.backend.mock ){

		app.get( '/win/', winController.win );
	}
};
