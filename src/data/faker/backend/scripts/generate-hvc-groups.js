const path = require( 'path' );

const hvcGroupsJson = require( './hvc-groups-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/hvc_groups/' );

let jsonFiles = {
	months: hvcGroupsJson.createMonths()
};

writeJsonFiles( outputPath, jsonFiles );
