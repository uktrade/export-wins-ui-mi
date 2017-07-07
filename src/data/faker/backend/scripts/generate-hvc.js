const path = require( 'path' );

const generateSchema = require( './lib/generate-schema' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/hvc/' );

let jsonFiles = {
	hvc: generateSchema( '/hvc/hvc.schema' )
};

writeJsonFiles( outputPath, jsonFiles );
