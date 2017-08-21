const path = require( 'path' );

const osRegionsJson = require( './lib/json-creators/os-regions-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/os_regions/' );

let jsonFiles = {
	overview: osRegionsJson.createOverview(),
	list: osRegionsJson.createList(),
	win_table: osRegionsJson.createWinTable()
};

writeJsonFiles( outputPath, jsonFiles );
