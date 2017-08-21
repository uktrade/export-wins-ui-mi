const path = require( 'path' );

const osRegionGroupsJson = require( './lib/json-creators/os-region-groups-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/os_region_groups/' );

let jsonFiles = {
	'index': osRegionGroupsJson.createList()
};

writeJsonFiles( outputPath, jsonFiles );
