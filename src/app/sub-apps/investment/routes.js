const indexController = require( './controllers/controller.index' );

module.exports = function( router, isDev ){

	router.get( '/', indexController );

	return router;
};
