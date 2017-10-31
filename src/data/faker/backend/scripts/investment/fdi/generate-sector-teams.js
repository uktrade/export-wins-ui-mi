const path = require( 'path' );

const sectorTeamsJson = require( '../../lib/json-creators/investment/fdi/sector-teams-json' );
const writeJsonFiles = require( '../../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../../output/investment/fdi/sector_teams/' );

let jsonFiles = {
	index: sectorTeamsJson.createIndex(),
	sector_team: sectorTeamsJson.createTeam()
};

writeJsonFiles( outputPath, jsonFiles );