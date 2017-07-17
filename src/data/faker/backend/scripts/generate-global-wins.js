const path = require( 'path' );

const userJson = require( './global-wins-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/global_wins/' );

let jsonFiles = {
	index: userJson.createWins()
};

writeJsonFiles( outputPath, jsonFiles );
