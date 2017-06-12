const path = require( 'path' );
const appConfig = require( '../../app/config' );

const host = ( process.env.TEST_HOST || 'localhost' );
const port = ( process.env.TEST_PORT || process.env.SERVER_PORT || process.env.PORT || '8080' );
const seleniumServer = ( process.env.SELENIUM_SERVER || 'localhost' );
const seleniumServerPort = ( process.env.SELENIUM_SERVER_PORT || '4444' );

module.exports = {

	host,
	port,
	seleniumServer,
	seleniumServerPort,
	browser: ( process.env.TEST_BROWSER || 'safari' ),
	baseUrl: `http://${ host }:${ port }`,
	seleniumServerUrl: `http://${ seleniumServer }:${ seleniumServerPort }/wd/hub`,
	screenshotDir: path.resolve( __dirname, 'output/screenshots' ),
	accessibilityReportDir: path.resolve( __dirname, 'output/accessibility-reports' ),
	backendUrl: appConfig.backend.href
};
