const fs = require( 'fs' );
const path = require( 'path' );

/*
	Read each file from disk to ensure it's a clean version of the data
*/
module.exports = function( file ){

	const fileWithPath = path.resolve( __dirname, '../fake-data/backend' + file );
	const data = fs.readFileSync( fileWithPath );

	return data;
};
