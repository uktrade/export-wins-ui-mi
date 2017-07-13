const path = require( 'path' );

const sharedJson = require( './shared-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/shared/' );

let jsonFiles = {
	index: sharedJson.createIndex(),
	sector: sharedJson.createSector(),
	campaigns: sharedJson.createCampaigns(),
	months: sharedJson.createMonths(),
	top_non_hvcs: sharedJson.createTopNonHvcs(),
	win_table: sharedJson.createWinTable()
};

writeJsonFiles( outputPath, jsonFiles );
