const config = require( './config' );

const bodyParser = require( 'body-parser' );
const csurf = require('csurf');

const indexController = require( './controllers/controller.index' );
const dateController = require( './controllers/controller.date' );
const sectorTeamController = require( './controllers/controller.sector-teams' );
const regionController = require( './controllers/controller.overseas-regions' );
const hvcGroupController = require( './controllers/controller.hvc-groups' );
const winController =  require( './controllers/controller.win' );
const hvcController = require( './controllers/controller.hvc' );
const countryController = require( './controllers/controller.countries' );
const postController = require( './controllers/controller.posts' );

const createUserMiddleware = require( './lib/middleware/user' );
const dateRange = require( './lib/middleware/date-range' );
const returnPath = require( './lib/middleware/return-path' );

module.exports = function( express, app, isDev ){

	const user = createUserMiddleware( isDev );
	const urlBodyParser = bodyParser.urlencoded( { extended: true, limit: '1mb' } );
	const csrfProtection = csurf( { cookie: true } );

	app.use( dateRange );

	app.get( '/', user, indexController );
	app.get( '/select-date/', user, returnPath, dateController.selectYear );
	app.get( '/select-date/:year/', user, returnPath, csrfProtection, dateController.selectDates );
	app.post( '/select-date/:year/', user, returnPath, urlBodyParser, csrfProtection, dateController.setDate );

	app.get( '/sector-teams/', user, sectorTeamController.list );
	app.get( '/sector-teams/overview/', user, sectorTeamController.overview );
	app.get( '/sector-teams/:id', user, sectorTeamController.team );
	app.get( '/sector-teams/:id/wins/', user, sectorTeamController.wins );
	app.get( '/sector-teams/:id/non-hvc-wins/', user, sectorTeamController.nonHvcWins );

	app.get( '/overseas-regions/', user, regionController.list );
	app.get( '/overseas-regions/overview/', user, regionController.overview );
	app.get( '/overseas-regions/:id', user, regionController.region );
	app.get( '/overseas-regions/:id/wins/', user, regionController.wins );
	app.get( '/overseas-regions/:id/non-hvc-wins/', user, regionController.nonHvcWins );

	app.get( '/hvc/:id', user, hvcController.hvc );
	app.get( '/hvc/:id/wins', user, hvcController.winList );

	app.get( '/hvc-groups/', user, hvcGroupController.list );
	app.get( '/hvc-groups/:id', user, hvcGroupController.group );
	app.get( '/hvc-groups/:id/wins', user, hvcGroupController.wins );

	app.get( '/countries/', user, countryController.list );
	app.get( '/countries/:code/',user, countryController.country );
	app.get( '/countries/:code/wins/',user, countryController.wins );
	app.get( '/countries/:code/non-hvc-wins/', user, countryController.nonHvcWins );

	app.get( '/posts/', user, postController.list );
	app.get( '/posts/:id/', user, postController.post );
	app.get( '/posts/:id/wins/', user, postController.wins );
	app.get( '/posts/:id/non-hvc-wins/', user, postController.nonHvcWins );

	if( config.backend.mock ){

		app.get( '/win/', winController.win );
	}
};
