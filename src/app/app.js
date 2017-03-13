
const cluster = require( 'cluster' );
const config = require( './config' );
const logger = require( './lib/logger' );
const createApp = require( './lib/app' ).create;

const serverConfig = config.server;
const numberOfWorkers = serverConfig.workers;
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

	const app = createApp();
	const env = app.get( 'env' );
	const isDev = ( 'development' === env );

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
