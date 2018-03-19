const navMiddleware = require( '../../middleware/nav' );
const indexController = require( './controllers/controller.index' );

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

	return router;
};
