const path = require( 'path' );

const generateSchema = require( './lib/generate-schema' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/user/' );

let jsonFiles = {
	me: generateSchema( '/user/me.schema' )
};

writeJsonFiles( outputPath, jsonFiles );
