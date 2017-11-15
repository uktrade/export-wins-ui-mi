const path = require( 'path' );

const csvJson = require( '../lib/json-creators/csv/csv-json' );
const writeJsonFiles = require( '../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../output/csv/' );

let jsonFiles = {
	all_files: csvJson.createList()
};

writeJsonFiles( outputPath, jsonFiles );
