
const indexController = require( './controllers/controller.index' );
const sectorController = require( './controllers/controller.sectors' );
const regionController = require( './controllers/controller.regions' );

module.exports = function( express, app ){

	app.get( '/', indexController );
	app.get( '/sectors/', sectorController.sectorList );
	app.get( '/sectors/overview/', sectorController.overview );
	app.get( '/sectors/:id', sectorController.sector );
	app.get( '/regions/', regionController.regionList );
	app.get( '/regions/overview/', regionController.overview );
	app.get( '/regions/:id', regionController.region );
};
