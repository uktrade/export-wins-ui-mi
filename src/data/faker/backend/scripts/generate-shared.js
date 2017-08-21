const path = require( 'path' );

const sharedJson = require( './lib/json-creators/shared-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/shared/' );

let jsonFiles = {
	index: sharedJson.createIndex(),
	sector: sharedJson.createSector(),
	campaigns: sharedJson.createCampaigns(),
	months: sharedJson.createMonths(),
	top_non_hvcs: sharedJson.createTopNonHvcs()
};

writeJsonFiles( outputPath, jsonFiles );
