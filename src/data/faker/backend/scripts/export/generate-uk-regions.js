const path = require( 'path' );

const ukRegionsJson = require( '../lib/json-creators/export/uk-regions-json' );
const writeJsonFiles = require( '../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../output/export/uk_regions/' );

let jsonFiles = {
	list: ukRegionsJson.createList(),
	region: ukRegionsJson.createRegion(),
	win_table: ukRegionsJson.createWinTable(),
	months: ukRegionsJson.createMonths(),
	overview: ukRegionsJson.createOverview()
};

writeJsonFiles( outputPath, jsonFiles );
