const path = require( 'path' );

const ukRegionsJson = require( './lib/json-creators/uk-regions-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/uk_regions/' );

let jsonFiles = {
	list: ukRegionsJson.createList(),
	region: ukRegionsJson.createRegion(),
	win_table: ukRegionsJson.createWinTable()
};

writeJsonFiles( outputPath, jsonFiles );
