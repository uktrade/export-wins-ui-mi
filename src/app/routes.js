
const indexController = require( './controllers/controller.index' );
const sectorController = require( './controllers/controller.sectors' );
const regionController = require( './controllers/controller.regions' );

module.exports = function( express, app ){

	app.get( '/', indexController );
	app.get( '/sectors/', sectorController.sectorList );
	app.get( '/sectors/:id', sectorController.sector );
	app.get( '/regions/', regionController.region );
};
