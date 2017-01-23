
const cluster = require( 'cluster' );
const logger = require( './lib/logger' );
const config = require( './config' );

const numberOfWorkers = config.server.workers;
const isClustered = ( numberOfWorkers > 1 );

function listenForWorkerMessages( worker ){

	worker.on( 'message', function( msg ){

		logger.debug( 'Master sending message to workers' );

		Object.keys( cluster.workers ).forEach( function( workerId ){
			cluster.workers[ workerId ].send( msg );
		} );
	} );
}

function startApp(){

	const express = require( 'express' );
	const routes = require( './routes' );
	const nunjucks = require( 'nunjucks' );
	const serveStatic = require( 'serve-static' );
	const cookieParser = require( 'cookie-parser' );
	const path = require( 'path' );
	const morganLogger = require( 'morgan' );
	const compression = require( 'compression' );

	const nunjucksFilters = require( './lib/nunjucks-filters' );
	const alice = require( './lib/middleware/alice' );
	const uuid = require( './lib/middleware/uuid' );
	const feedbackEmail = require( './lib/middleware/feedback-email' );

	const app = express();
	const serverConfig = config.server;
	const pathToPublic = path.resolve( __dirname, '../public' );
	const env = app.get( 'env' );
	const isDev = ( 'development' === env );

	let nunjucksEnv;
	let staticMaxAge = 0;

	app.set( 'view engine', 'html' );
	app.set( 'view cache', config.views.cache );

	nunjucksEnv = nunjucks.configure( ( __dirname + '/views' ), {
		autoescape: true,
		watch: config.isDev,
		noCache: !config.views.cache,
		express: app
	} );

	nunjucksFilters( nunjucksEnv );

	if( !isDev ){

		app.use( compression() );
		staticMaxAge = '2y';
	}

	app.use( '/public', serveStatic( pathToPublic, { maxAge: staticMaxAge } ) );
	app.use( morganLogger( ( isDev ? 'dev' : 'combined' ) ) );
	app.use( cookieParser() );
	app.use( uuid );
	app.use( alice );
	app.use( feedbackEmail );

	routes( express, app );

	app.listen( serverConfig.port, function(){

		if( isClustered ){

			logger.info( 'Worker ' + cluster.worker.id + ' created: App running in %s mode, listening at http://%s:%s', env, serverConfig.host, serverConfig.port );

		} else {

			logger.info( 'App running in %s mode', env );
			logger.info( 'Listening at http://%s:%s', serverConfig.host, serverConfig.port );
		}
	});

	if( isClustered ){

		cluster.worker.on( 'message', function( msg ){

			logger.debug( 'Worker ' + cluster.worker.id + ' received message' + msg );
		} );

		if( isDev ){
			app.use( function( req, res, next ){

				logger.debug( 'Worker: %s, handling request: %s', cluster.worker.id, req.url );
				next();
			} );
		}
	}
}

if( isClustered ){

	//if this is the master then create the workers
	if( cluster.isMaster ){

		for( let i = 0; i < numberOfWorkers; i++ ) {

			listenForWorkerMessages( cluster.fork() );
		}

	//if we are a worker then create an HTTP server
	} else {

		startApp();
	}

} else {

	startApp();
}
