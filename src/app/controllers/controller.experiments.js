const saveUser = require( '../lib/save-user' );
const safePath = require( '../lib/safe-path' );
const reporter = require( '../lib/reporter' );

module.exports = function( req, res ){

	const returnPath = safePath( req.query.path );

	if( req.user.internal ){

		req.user.experiments = !req.user.experiments;

		saveUser( req.user, res, ( err ) => {

			if( err ){

				const captureError = new Error( 'Unable to save experiments state' );
				captureError.saveError = err;
				reporter.captureException( captureError );
			}

			res.redirect( returnPath );
		} );

	} else {

		res.redirect( returnPath );
	}
};
