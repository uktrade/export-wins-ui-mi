
const config = require( '../../config' );
const uuid = config.server.uuid;
const uuidPattern = new RegExp( '^\/' + uuid + '(\/?.+)$' );

module.exports = function( req, res, next ){

	if( uuidPattern.test( req.url ) ){
		
		req.url = req.url.replace( uuidPattern, '$1' );
		res.locals.uuid = ( '/' + uuid );
		next();

	} else {

		res.status( 404 );
		res.send( 'Cannot GET ' + req.url );
	}
};
