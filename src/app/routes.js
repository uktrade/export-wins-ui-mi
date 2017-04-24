const config = require( './config' );

const indexController = require( './controllers/controller.index' );
const sectorTeamController = require( './controllers/controller.sector-teams' );
const regionController = require( './controllers/controller.overseas-regions' );
const hvcGroupController = require( './controllers/controller.hvc-groups' );
const winController =  require( './controllers/controller.win' );
const hvcController = require( './controllers/controller.hvc' );
const winsController = require( './controllers/controller.wins' );
const loginController = require( './controllers/controller.login' );

const linkHvc = require( './lib/middleware/link-hvc' );

module.exports = function( express, app ){

	app.get( '/', indexController );

	app.get( '/login/', loginController );

	app.get( '/sector-teams/', sectorTeamController.list );
	app.get( '/sector-teams/overview/', sectorTeamController.overview );
	app.get( '/sector-teams/:id', linkHvc, sectorTeamController.team );

	app.get( '/overseas-regions/', regionController.list );
	app.get( '/overseas-regions/overview/', regionController.overview );
	app.get( '/overseas-regions/:id', regionController.region );

	app.get( '/hvc-groups/', hvcGroupController.list );
	app.get( '/hvc-groups/:id', hvcGroupController.group );

	if( config.backend.mock ){

		app.get( '/win/', winController.win );
		app.get( '/wins/', winsController.list );

		app.get( '/hvc/:id', hvcController.hvc );
	}
};
