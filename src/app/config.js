
function env( name, defaultValue ){

	var exists = ( typeof process.env[ name ] !== 'undefined' );

	return ( exists ? process.env[ name ] : defaultValue );
}

function bool( name, defaultValue ){

	return ( env( name, defaultValue ) + '' ) === 'true';
}

let config = {
	server: {
		protocol: env( 'SERVER_PROTOCOL', 'http' ),
		host: env( 'SERVER_HOST', 'localhost' ),
		port: env( 'SERVER_PORT', env( 'PORT', 8080 ) ),
		workers: env( 'SERVER_WORKERS', 1 ),
		uuid: env( 'SERVER_UUID', '05422c73-064a-4277-aca8-07774dd3e3a0' )
	},
	views: {
		cache: bool( 'CACHE_VIEWS', true )
	},
	feedbackEmail: env( 'FEEDBACK_EMAIL' ),
	cookieSecret: env( 'COOKIE_SECRET' ),
	logLevel: env( 'LOG_LEVEL', 'warn' ),
	sentryDsn: env( 'SENTRY_DSN' ),
	backend: {
		secret: env( 'MI_SECRET' ),
		protocol: env( 'MI_PROTOCOL', 'http' ),
		host: env( 'MI_HOST', 'localhost' ),
		port: env( 'MI_PORT', 8000 ),
		timeout: env( 'MI_TIMEOUT', 1000 ),

		stub: bool( 'STUB_MI', false ),
		fake: bool( 'FAKE_MI', false ),
		mock: bool( 'MOCK_MI', false )
	}
};

config.backend.href = `${config.backend.protocol}://${config.backend.host}:${config.backend.port}`;

module.exports = config;
