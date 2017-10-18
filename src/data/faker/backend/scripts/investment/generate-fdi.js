const path = require( 'path' );

const fdiJson = require( '../lib/json-creators/investment/fdi-json' );
const writeJsonFiles = require( '../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../output/investment/fdi/' );

let jsonFiles = {
	overview: fdiJson.createOverview(),
	overview_yoy: fdiJson.createOverviewYoy()
};

writeJsonFiles( outputPath, jsonFiles );
