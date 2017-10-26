const os = require( 'os' );

function env( name, defaultValue ){

	var exists = ( typeof process.env[ name ] !== 'undefined' );

	return ( exists ? process.env[ name ] : defaultValue );
}

function bool( name, defaultValue ){

	return ( env( name, defaultValue ) + '' ) === 'true';
}

const cpus = ( os.cpus().length || 1 );
const defaultWorkers = ( cpus > 1 ? cpus - 1 : cpus );

let config = {
	showErrors: ( process.env.NODE_ENV !== 'production' ),
	version: env( 'npm_package_version', 'unknown' ),
	server: {
		protocol: env( 'SERVER_PROTOCOL', 'http' ),
		host: env( 'SERVER_HOST', 'localhost' ),
		port: env( 'SERVER_PORT', env( 'PORT', 8080 ) ),
		cpus,
		workers: env( 'SERVER_WORKERS', env( 'WEB_CONCURRENCY', defaultWorkers ) )
	},
	views: {
		cache: bool( 'CACHE_VIEWS', true )
	},
	financialYearStart: env( 'FINANCIAL_YEAR_START', 2016 ),
	feedbackEmail: env( 'FEEDBACK_EMAIL' ),
	feedbackSurvey: env( 'FEEDBACK_SURVEY' ),
	faqLink: env( 'FAQ_LINK' ),
	cookieSecret: env( 'COOKIE_SECRET' ),
	userCookieName: env( 'USER_COOKIE_NAME', 'user' ),
	logLevel: env( 'LOG_LEVEL', 'warn' ),
	sentryDsn: env( 'SENTRY_DSN' ),
	analyticsId: env( 'ANALYTICS_ID' ),
	coreLoginUrl: env( 'CORE_LOGIN_URL', 'https://adfsmobile.azurecore.com/adfs/ls/' ),
	exportWinsUrl: env( 'EXPORT_WINS_URL', 'https://www.exportwins.service.trade.gov.uk/' ),
	jwt: {
		secret: env( 'JWT_SECRET', 'thisshouldbeavalidsecret' )
	},
	oauthParamLength: env( 'OAUTH_PARAM_LENGTH', '75' ),
	internalUsers: env( 'INTERNAL_USERS', '' ),
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
