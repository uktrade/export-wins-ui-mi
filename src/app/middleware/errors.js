const config = require( '../config' );
const logger = require( '../lib/logger' );

module.exports = {

	handle404: function( req, res, next ){

		res.status( 404 );
		res.render( 'error/404.html' );
	},

	catchAll: function( err, req, res, next ){

		if( res.headersSent ){

			next( err );

		} else {

			if( err.code === 'TOO_MANY_BYTES' ){

				res.sendStatus( 413 );

			} else {

				res.status( 500 );
				res.render( 'error/default.html', { error: err, showErrors: config.showErrors } );
			}
		}

		logger.error( 'Something went wrong: ', err );
	}
};
