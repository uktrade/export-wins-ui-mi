const path = require( 'path' );

const sectorTeamsJson = require( '../lib/json-creators/investment/sector-teams-json' );
const writeJsonFiles = require( '../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../output/investment/sector_teams/' );

let jsonFiles = {
	index: sectorTeamsJson.createIndex()
};

writeJsonFiles( outputPath, jsonFiles );
