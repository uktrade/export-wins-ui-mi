const config = require( '../config' );
const winston = require( 'winston' );

const colorize = ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development' );

const logger = new winston.createLogger({
	level: config.logLevel,
	transports: [
		new winston.transports.Console( { colorize } )
	]
});

module.exports = logger;
