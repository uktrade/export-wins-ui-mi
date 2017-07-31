const path = require( 'path' );

const sectorTeamsJson = require( './sector-teams-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/sector_teams/' );

let jsonFiles = {
	index: sectorTeamsJson.createIndex(),
	overview: sectorTeamsJson.createOverview(),
	win_table: sectorTeamsJson.createWinTable()
};

writeJsonFiles( outputPath, jsonFiles );
