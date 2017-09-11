const MAX_BYTES = 50000;

function getByteLength( str ){

	return Buffer.byteLength( str, 'utf8' );
}

module.exports = function( req, res, next ){

	let data = '';

	function handleChunk( chunk ){

		data += chunk;

		if( getByteLength( data ) > MAX_BYTES ){

			const err = new Error( 'Too many bytes' );
			err.code = 'TOO_MANY_BYTES';

			req.removeListener( 'data', handleChunk );
			next( err );
		}
	}

	req.on( 'data', handleChunk );
	req.on( 'error', ( err ) => next( err ) );
	req.on( 'end', () => {

		req.data = data;
		next();
	} );
};
