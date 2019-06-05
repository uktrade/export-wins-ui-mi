const csurf = require('csurf');

const exportRoutes = require( './export' );
const investmentRoutes = require( '../sub-apps/investment/routes' );

const loginController = require( '../controllers/controller.login' );
const dateController = require( '../controllers/controller.date' );
const downloadController = require( '../controllers/controller.download' );
const experimentsController = require( '../controllers/controller.experiments' );
const refreshController = require( '../controllers/controller.refresh' );
const changeFyController = require( '../controllers/controller.change-fy' );

const returnPath = require( '../middleware/return-path' );
const dateRange = require( '../middleware/date-range' );
const user = require( '../middleware/user' );
const navMiddleware = require( '../middleware/nav' );
const csrfProtection = csurf( { cookie: true } );
const downloadNav = navMiddleware( { isDownload: true } );

module.exports = function( express, app, isDev ){

	const urlBodyParser = express.urlencoded( { extended: true, limit: '1mb' } );

	app.get( '/login/', loginController.oauth );
	app.get( '/login/callback/', loginController.oauthCallback );
	app.get( '/sign-out/', loginController.signout );

	app.get( '/downloads/', user, downloadNav, downloadController.list );
	app.get( '/downloads/:id/', user, downloadController.file );

	app.get( '/refresh/', refreshController );
	app.get( '/experiments/', user, experimentsController );
	app.get( '/change-fy/', changeFyController );

	app.use( dateRange );

	app.get( '/select-date/', user, returnPath, dateController.selectYear );
	app.get( '/select-date/:year/', user, returnPath, csrfProtection, dateController.selectDates );
	app.post( '/select-date/:year/', user, returnPath, urlBodyParser, csrfProtection, dateController.setDate );

	app.use( exportRoutes( express.Router(), user, isDev ) );
	app.use( investmentRoutes( express.Router(), user, isDev ) );
};
