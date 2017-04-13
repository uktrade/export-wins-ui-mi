const fs = require( 'fs' );
const path = require( 'path' );

/*
	Read each file from disk to ensure it's a clean version of the data
*/
module.exports = function( file ){

	if( file.substr( -1 ) === '/' ){

		file += 'index';
	}

	const fileWithPath = path.resolve( __dirname, '../fake-data/backend' + file + '.json' );
	const data = fs.readFileSync( fileWithPath );

	try {

		return JSON.parse( data );

	} catch ( e ){

		console.error( 'Unable to transform JSON for file: %s', fileWithPath );
		console.error( e );
	}
};
