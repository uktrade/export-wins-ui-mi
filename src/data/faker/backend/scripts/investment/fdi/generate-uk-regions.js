const path = require( 'path' );

const ukRegionsJson = require( '../../lib/json-creators/investment/fdi/uk-regions-json' );
const writeJsonFiles = require( '../../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../../output/investment/fdi/uk_regions/' );

let jsonFiles = {
	index: ukRegionsJson.createIndex()
};

writeJsonFiles( outputPath, jsonFiles );
