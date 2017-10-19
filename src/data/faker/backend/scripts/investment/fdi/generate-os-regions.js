const path = require( 'path' );

const osRegionsJson = require( '../../lib/json-creators/investment/fdi/os-regions-json' );
const writeJsonFiles = require( '../../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../../output/investment/fdi/os_regions/' );

let jsonFiles = {
	index: osRegionsJson.createIndex()
};

writeJsonFiles( outputPath, jsonFiles );
