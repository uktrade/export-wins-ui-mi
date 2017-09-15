const path = require( 'path' );

const countriesJson = require( '../lib/json-creators/export/countries-json' );
const writeJsonFiles = require( '../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../output/export/countries/' );

let jsonFiles = {
	index: countriesJson.createList(),
	win_table: countriesJson.createWinTable()
};

writeJsonFiles( outputPath, jsonFiles );
