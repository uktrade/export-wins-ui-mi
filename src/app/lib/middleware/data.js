module.exports = function( req, res, next ){

	let data = '';

	req.on( 'data', ( chunk ) => data += chunk );
	req.on( 'error', ( err ) => next( err ) );
	req.on( 'end', () => {

		req.data = data;
		next();
	} );
};
