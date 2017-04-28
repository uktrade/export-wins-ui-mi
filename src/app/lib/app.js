const express = require( 'express' );
const nunjucks = require( 'nunjucks' );
const serveStatic = require( 'serve-static' );
const cookieParser = require( 'cookie-parser' );
const path = require( 'path' );
const morganLogger = require( 'morgan' );
const compression = require( 'compression' );

const routes = require( '../routes' );
const config = require( '../config' );

const reporter = require( './reporter' );
const nunjucksFilters = require( './nunjucks-filters' );
const staticGlobals = require( './static-globals' );

const ping = require( './middleware/ping' );
const data = require( './middleware/data' );
const year = require( './middleware/year' );
const globals = require( './middleware/globals' );

const loginController = require( '../controllers/controller.login' );
const samlController = require( '../controllers/controller.saml' );


module.exports = {

	create: function(){

		const app = express();
		const env = app.get( 'env' );
		const isDev = ( 'development' === env );

		const pathToPublic = path.resolve( __dirname, '../../public' );
		const pathToUkTradeElements = path.resolve( __dirname, ( isDev ? '../../../' : '../../' ), 'node_modules/@uktrade/trade_elements' );
		const pathToUkTradePublic = path.resolve( __dirname, pathToUkTradeElements, 'dist' );

		let nunjucksEnv;
		let staticMaxAge = 0;

		app.set( 'view engine', 'html' );
		app.set( 'view cache', config.views.cache );

		nunjucksEnv = nunjucks.configure( [
				`${__dirname}/../views`,
				`${pathToUkTradeElements}/dist/nunjucks`,
			], {
			autoescape: true,
			watch: config.isDev,
			noCache: !config.views.cache,
			express: app
		} );

		staticGlobals( nunjucksEnv );
		nunjucksFilters( nunjucksEnv );

		reporter.setup( app );

		if( !isDev ){

			app.use( compression() );
			staticMaxAge = '2y';
		}

		app.use( '/public', serveStatic( pathToPublic, { maxAge: staticMaxAge } ) );
		app.use( '/public/uktrade', serveStatic( pathToUkTradePublic, { maxAge: staticMaxAge } ) );
		app.use( morganLogger( ( isDev ? 'dev' : 'combined' ) ) );
		app.use( cookieParser() );
		app.use( ping );
		app.get( '/saml2/metadata/', samlController.metadata );
		app.post( '/saml2/acs/', data, samlController.acs );
		app.get( '/login/', loginController );
		app.use( year );
		app.use( globals( nunjucksEnv ) );

		routes( express, app );

		reporter.handleErrors( app );

		return app;
	}
};
