const path = require( 'path' );

const overviewJson = require( '../../lib/json-creators/investment/fdi/overview-json' );
const writeJsonFiles = require( '../../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../../output/investment/fdi/' );

let jsonFiles = {
	overview: overviewJson.createOverview(),
	overview_yoy: overviewJson.createOverviewYoy()
};

writeJsonFiles( outputPath, jsonFiles );
