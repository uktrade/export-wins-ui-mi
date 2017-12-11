const path = require( 'path' );

const sectorTeamsJson = require( '../../lib/json-creators/investment/fdi/sector-teams-json' );
const writeJsonFiles = require( '../../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../../output/investment/fdi/sector_teams/' );

let jsonFiles = {
	index: sectorTeamsJson.createIndex(),
	overview: sectorTeamsJson.createOverview(),
	sector_team: sectorTeamsJson.createTeam(),
	sector_team_hvc: sectorTeamsJson.createTeam(),
	sector_team_non_nvc: sectorTeamsJson.createTeam(),
	win_table: sectorTeamsJson.createWinTable()
};

writeJsonFiles( outputPath, jsonFiles );
