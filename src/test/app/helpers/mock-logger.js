module.exports = {
	debug: jasmine.createSpy( 'logger.debug' ),
	info: jasmine.createSpy( 'logger.info' ),
	warn: jasmine.createSpy( 'logger.warn' ),
	error: jasmine.createSpy( 'logger.error' )
};
