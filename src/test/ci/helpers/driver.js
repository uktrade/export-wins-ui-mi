const webdriver = require( 'selenium-webdriver' );
const config = require( '../test-config' );

const driver = new webdriver.Builder()
						.forBrowser( config.browser )
						.usingServer( config.seleniumServerUrl )
						.build();

module.exports = driver;
