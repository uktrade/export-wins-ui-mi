const express = require( 'express' );
const nunjucks = require( 'nunjucks' );
const cookieParser = require( 'cookie-parser' );
const path = require( 'path' );
const morganLogger = require( 'morgan' );
const compression = require( 'compression' );

const routes = require( './routes' );
const config = require( './config' );

const reporter = require( './lib/reporter' );
const nunjucksFilters = require( './lib/nunjucks-filters' );
const staticGlobals = require( './lib/static-globals' );

const ping = require( './middleware/ping' );
const year = require( './middleware/year' );
const globals = require( './middleware/globals' );
const forceHttps = require( './middleware/force-https' );
const headers = require( './middleware/headers' );
const errors = require( './middleware/errors' );

module.exports = {

	create: function(){

		const app = express();
		const env = app.get( 'env' );
		const isDev = ( 'development' === env );

		const pathToPublic = path.resolve( __dirname, '../public' );
		const pathToUkTradeElements = path.resolve( __dirname, ( isDev ? '../../' : '../' ), 'node_modules/@uktrade/trade_elements' );
		const pathToUkTradePublic = path.resolve( __dirname, pathToUkTradeElements, 'dist' );

		let nunjucksEnv;
		let staticMaxAge = 0;

		app.set( 'view engine', 'html' );
		app.set( 'view cache', config.views.cache );

		app.disable( 'x-powered-by' );

		nunjucksEnv = nunjucks.configure( [
				`${__dirname}/views`,
				`${__dirname}/sub-apps`,
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

		app.use( forceHttps( isDev ) );
		app.use( '/public', express.static( pathToPublic, { maxAge: staticMaxAge } ) );
		app.use( '/public/uktrade', express.static( pathToUkTradePublic, { maxAge: staticMaxAge } ) );
		app.use( morganLogger( ( isDev ? 'dev' : 'combined' ) ) );
		app.use( cookieParser() );
		app.use( headers( isDev ) );
		app.use( ping );
		app.use( year );
		app.use( globals( nunjucksEnv ) );

		routes( express, app, isDev );

		app.use( errors.handle404 );

		reporter.handleErrors( app );

		app.use( errors.catchAll );

		return app;
	}
};
