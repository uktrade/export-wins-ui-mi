const path = require( 'path' );

const osRegionsJson = require( './os-regions-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/os_regions/' );

let jsonFiles = {
	overview: osRegionsJson.createOverview()
};

writeJsonFiles( outputPath, jsonFiles );
