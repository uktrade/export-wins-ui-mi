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
const alice = require( './middleware/alice' );
const uuid = require( './middleware/uuid' );
const locals = require( './middleware/locals' );
const ping = require( './middleware/ping' );

module.exports = {

	create: function(){

		const app = express();
		const pathToPublic = path.resolve( __dirname, '../../public' );
		const pathToUkTradePublic = path.resolve( __dirname, '../../../node_modules/@uktrade/trade_elements/dist' );
		const env = app.get( 'env' );
		const isDev = ( 'development' === env );

		let nunjucksEnv;
		let staticMaxAge = 0;

		app.set( 'view engine', 'html' );
		app.set( 'view cache', config.views.cache );

		nunjucksEnv = nunjucks.configure( [
				`${__dirname}/../views`,
				`${__dirname}/../../../node_modules/@uktrade/trade_elements/dist/nunjucks`,
			], {
			autoescape: true,
			watch: config.isDev,
			noCache: !config.views.cache,
			express: app
		} );

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
		app.use( uuid );
		app.use( locals );
		app.use( alice );

		routes( express, app );

		reporter.handleErrors( app );

		return app;
	}
};