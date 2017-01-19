
const indexController = require( './controllers/controller.index' );
const sectorTeamController = require( './controllers/controller.sector-teams' );
const regionController = require( './controllers/controller.regions' );
const hvcGroupController = require( './controllers/controller.hvc-groups' );

module.exports = function( express, app ){

	app.get( '/', indexController );

	app.get( '/sector-teams/', sectorTeamController.list );
	app.get( '/sector-teams/overview/', sectorTeamController.overview );
	app.get( '/sector-teams/:id', sectorTeamController.team );

	app.get( '/regions/', regionController.regionList );
	app.get( '/regions/overview/', regionController.overview );
	app.get( '/regions/:id', regionController.region );

	app.get( '/hvc-groups/', hvcGroupController.list );
	app.get( '/hvc-groups/:id', hvcGroupController.group );
};
