const csurf = require('csurf');

const exportRoutes = require( './export' );
const investmentRoutes = require( '../sub-apps/investment/routes' );

const loginController = require( '../controllers/controller.login' );
const samlController = require( '../controllers/controller.saml' );
const dateController = require( '../controllers/controller.date' );
const downloadController = require( '../controllers/controller.download' );

const data = require( '../middleware/data' );
const returnPath = require( '../middleware/return-path' );
const dateRange = require( '../middleware/date-range' );
const createUserMiddleware = require( '../middleware/user' );

const csrfProtection = csurf( { cookie: true } );

module.exports = function( express, app, isDev ){

	const urlBodyParser = express.urlencoded( { extended: true, limit: '1mb' } );
	const user = createUserMiddleware( isDev );

	app.get( '/saml2/metadata/', samlController.metadata );
	app.post( '/saml2/acs/', data, samlController.acs );

	app.get( '/login/', loginController.oauth );
	app.get( '/login/callback/', loginController.oauthCallback );
	app.get( '/login-saml/', loginController.saml );

	app.get( '/download-csv/', downloadController.csv );

	app.use( dateRange );

	app.get( '/select-date/', user, returnPath, dateController.selectYear );
	app.get( '/select-date/:year/', user, returnPath, csrfProtection, dateController.selectDates );
	app.post( '/select-date/:year/', user, returnPath, urlBodyParser, csrfProtection, dateController.setDate );

	app.use( exportRoutes( express.Router(), user, isDev ) );
	app.use( '/investment/', user, investmentRoutes( express.Router(), isDev ) );
};
