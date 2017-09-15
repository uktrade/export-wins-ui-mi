const path = require( 'path' );

const userJson = require( '../lib/json-creators/export/global-wins-json' );
const writeJsonFiles = require( '../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../output/export/global_wins/' );

let jsonFiles = {
	index: userJson.createWins()
};

writeJsonFiles( outputPath, jsonFiles );
