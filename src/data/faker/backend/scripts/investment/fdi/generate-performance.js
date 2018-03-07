const path = require( 'path' );

const performance = require( '../../lib/json-creators/investment/fdi/performance-json' );
const writeJsonFiles = require( '../../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../../output/investment/fdi/performance/' );

let jsonFiles = {
	index: performance.index(),
	'tab.sectors': performance.tab()
};

writeJsonFiles( outputPath, jsonFiles );
