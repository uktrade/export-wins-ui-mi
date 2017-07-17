const path = require( 'path' );

const globalHvcsJson = require( './global-hvcs-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/global_hvcs/' );

let jsonFiles = {
	index: globalHvcsJson.createHvcs()
};

writeJsonFiles( outputPath, jsonFiles );
