const config = require( './config' );

const indexController = require( './controllers/controller.index' );
const sectorTeamController = require( './controllers/controller.sector-teams' );
const regionController = require( './controllers/controller.overseas-regions' );
const hvcGroupController = require( './controllers/controller.hvc-groups' );
const winController =  require( './controllers/controller.win' );
const hvcController = require( './controllers/controller.hvc' );
const winsController = require( './controllers/controller.wins' );

const linkHvc = require( './lib/middleware/link-hvc' );
const createUserMiddleware = require( './lib/middleware/user' );

module.exports = function( express, app, isDev ){

	const user = createUserMiddleware( isDev );

	app.get( '/', user, indexController );

	app.get( '/sector-teams/', user, sectorTeamController.list );
	app.get( '/sector-teams/overview/', user, sectorTeamController.overview );
	app.get( '/sector-teams/:id', user, linkHvc, sectorTeamController.team );

	app.get( '/overseas-regions/', user, regionController.list );
	app.get( '/overseas-regions/overview/', user, regionController.overview );
	app.get( '/overseas-regions/:id', user, regionController.region );

	app.get( '/hvc-groups/', user, hvcGroupController.list );
	app.get( '/hvc-groups/:id', user, hvcGroupController.group );

	if( config.backend.mock ){

		app.get( '/win/', winController.win );
		app.get( '/wins/', winsController.list );

		app.get( '/hvc/:id', hvcController.hvc );
	}
};
