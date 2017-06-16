const path = require( 'path' );

const osRegionGroupsJson = require( './os-region-groups-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/os_region_groups/' );

let jsonFiles = {
	'index.2016': osRegionGroupsJson.createList(),
	'index.2017': osRegionGroupsJson.createList()
};

writeJsonFiles( outputPath, jsonFiles );
