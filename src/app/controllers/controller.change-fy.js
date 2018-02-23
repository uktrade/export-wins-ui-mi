const safePath = require( '../lib/safe-path' );

module.exports = function( req, res ){

	const path = safePath( req.query.path );

	res.redirect( path );
};
