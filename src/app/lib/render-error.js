const logger = require( './logger' );

module.exports = function( res ){

	return function( err ){

		logger.error( err );

		res.render( 'error', { error: err } );
	};
};

