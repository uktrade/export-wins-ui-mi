const path = require( 'path' );

const osRegionsJson = require( '../lib/json-creators/investment/os-regions-json' );
const writeJsonFiles = require( '../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../output/investment/os_regions/' );

let jsonFiles = {
	index: osRegionsJson.createIndex()
};

writeJsonFiles( outputPath, jsonFiles );
