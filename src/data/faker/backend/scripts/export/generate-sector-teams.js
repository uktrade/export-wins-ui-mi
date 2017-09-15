const path = require( 'path' );

const sectorTeamsJson = require( '../lib/json-creators/export/sector-teams-json' );
const writeJsonFiles = require( '../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../output/export/sector_teams/' );

let jsonFiles = {
	index: sectorTeamsJson.createIndex(),
	overview: sectorTeamsJson.createOverview(),
	win_table: sectorTeamsJson.createWinTable()
};

writeJsonFiles( outputPath, jsonFiles );
