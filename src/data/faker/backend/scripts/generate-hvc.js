const path = require( 'path' );

const hvcJson = require( './hvc-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/hvc/' );

let jsonFiles = {
	hvc: hvcJson.createHvc(),
	win_table: hvcJson.createWinTable()
};

writeJsonFiles( outputPath, jsonFiles );
