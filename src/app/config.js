const os = require( 'os' );
const requiredEnvs = [];

function env( name, defaultValue ){

	var exists = ( typeof process.env[ name ] !== 'undefined' );

	return ( exists ? process.env[ name ] : defaultValue );
}

function bool( name, defaultValue ){

	return ( env( name, defaultValue ) + '' ) === 'true';
}

function number( name, defaultValue ){

	return parseInt( env( name, defaultValue ), 10 );
}

function requiredEnv( name, type = env ){

	requiredEnvs.push( name );

	return type( name );
}

const cpus = ( os.cpus().length || 1 );
const defaultWorkers = ( cpus > 1 ? cpus - 1 : cpus );
const isDev = ( ( process.env.NODE_ENV || 'development' ) === 'development' );

let config = {
	isDev,
	showErrors: isDev,
	version: env( 'npm_package_version', 'unknown' ),
	server: {
		protocol: env( 'SERVER_PROTOCOL', 'https' ),
		host: env( 'SERVER_HOST', 'localhost' ),
		port: env( 'SERVER_PORT', env( 'PORT', 8080 ) ),
		cpus,
		workers: env( 'SERVER_WORKERS', env( 'WEB_CONCURRENCY', defaultWorkers ) )
	},
	views: {
		cache: bool( 'CACHE_VIEWS', true )
	},
	financialYearStart: number( 'FINANCIAL_YEAR_START', 2016 ),
	feedbackEmail: env( 'FEEDBACK_EMAIL' ),
	feedbackSurvey: env( 'FEEDBACK_SURVEY' ),
	urls: {
		usingMi: requiredEnv( 'URL_USING_MI' ),
		kimPrinciples: requiredEnv( 'URL_KIM_PRINCIPLES' )
	},
	faqLink: env( 'FAQ_LINK' ),
	cookieSecret: requiredEnv( 'COOKIE_SECRET' ),
	userCookie: {
		name: env( 'USER_COOKIE_NAME', 'user' ),
		maxAge: number( 'USER_COOKIE_MAX_AGE', ( 1000 * 60 * 5 ) )
	},
	logLevel: env( 'LOG_LEVEL', 'warn' ),
	sentryDsn: env( 'SENTRY_DSN' ),
	analyticsId: env( 'ANALYTICS_ID' ),
	coreLoginUrl: env( 'CORE_LOGIN_URL', 'https://adfsmobile.azurecore.com/adfs/ls/' ),
	exportWinsUrl: env( 'EXPORT_WINS_URL', 'https://www.exportwins.service.trade.gov.uk/' ),
	datahubDomain: env( 'DATA_HUB_DOMAIN', 'https://www.datahub.trade.gov.uk' ),
	jwt: {
		secret: requiredEnv( 'JWT_SECRET' )
	},
	oauthParamLength: env( 'OAUTH_PARAM_LENGTH', '75' ),
	internalUsers: env( 'INTERNAL_USERS', '' ),
	backend: {
		secret: requiredEnv( 'MI_SECRET' ),
		protocol: env( 'MI_PROTOCOL', 'https' ),
		host: env( 'MI_HOST', 'localhost' ),
		port: env( 'MI_PORT', 8000 ),
		timeout: env( 'MI_TIMEOUT', 1000 ),

		stub: bool( 'STUB_MI', false ),
		fake: bool( 'FAKE_MI', false ),
		mock: bool( 'MOCK_MI', false )
	}
};

config.backend.href = `${config.backend.protocol}://${config.backend.host}:${config.backend.port}`;

const missing = [];

for( let name of requiredEnvs ){

	if( typeof process.env[ name ] === 'undefined' ){

		missing.push( name );
	}
}

if( missing.length ){

	console.log( 'Missing required env variables:', missing );
	throw new Error( 'Missing required env variables' );
}

module.exports = config;
