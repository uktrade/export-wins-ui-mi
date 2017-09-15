const path = require( 'path' );

const hvcJson = require( '../lib/json-creators/export/hvc-json' );
const writeJsonFiles = require( '../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../output/export/hvc/' );

let jsonFiles = {
	hvc: hvcJson.createHvc(),
	win_table: hvcJson.createWinTable()
};

writeJsonFiles( outputPath, jsonFiles );
