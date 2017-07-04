const config = require( '../../config' );
const logger = require( '../logger' );

module.exports = {

	handle404: function( req, res, next ){

		res.status( 404 );
		res.render( 'error/404.html' );
	},

	catchAll: function( err, req, res, next ){

		if( res.headersSent ){

			next( err );

		} else {

			res.status( 500 );
			res.render( 'error/default.html', { error: err, showErrors: config.showErrors } );
		}

		logger.error( 'Somthing went wrong: ', err );
	}
};