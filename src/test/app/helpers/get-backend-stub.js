const getBackendFile = require( './get-backend-file' );

module.exports = function( file ){

	if( file.substr( -1 ) === '/' ){

		file += 'index';
	}

	const fileWithExt = ( file + '.json' );
	const data = getBackendFile( fileWithExt );

	try {

		return JSON.parse( data );

	} catch ( e ){

		console.error( 'Unable to transform JSON for file: %s', fileWithExt );
		console.error( e );
	}
};
