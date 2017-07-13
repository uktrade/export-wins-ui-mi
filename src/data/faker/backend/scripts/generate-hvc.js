const path = require( 'path' );

const hvcJson = require( './hvc-json' );
const sharedJson = require( './shared-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/hvc/' );

let jsonFiles = {
	hvc: hvcJson.createHvc(),
	win_table: sharedJson.createWinTable()
};

writeJsonFiles( outputPath, jsonFiles );
