const path = require( 'path' );

const generateSchema = require( './lib/generate-schema' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/global_hvcs/' );

let jsonFiles = {
	index: generateSchema( '/global_hvcs/index.schema' )
};

writeJsonFiles( outputPath, jsonFiles );
