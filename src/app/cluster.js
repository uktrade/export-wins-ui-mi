
const cluster = require( 'cluster' );
const config = require( './config' );
const logger = require( './lib/logger' );
const createApp = require( './app' ).create;

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

	app.listen( serverConfig.port, function(){

		let messages = [];

		if( isClustered ){

			messages.push( `Worker ${cluster.worker.id} created` );
		}

		messages.push( `App running in ${ app.get( 'env' ) } mode, workers: ${ config.server.workers }, available: ${ config.server.cpus }` );
		messages.push( `Listening at http://${serverConfig.host}:${serverConfig.port}` );
		messages.push( `Connecting to backend at ${config.backend.href}` );

		logger.info( messages.join( '   ' ) );
	});

	if( isClustered ){

		cluster.worker.on( 'message', function( msg ){

			logger.debug( 'Worker ' + cluster.worker.id + ' received message' + msg );
		} );

		if( config.isDev ){
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
