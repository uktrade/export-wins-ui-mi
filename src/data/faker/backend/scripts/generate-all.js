const path = require( 'path' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

const osRegionsJson = require( './os-regions-json' );
const sectorTeamsJson = require( './sector-teams-json' );
const sharedJson = require( './shared-json' );

const outputPath = path.resolve( __dirname, '../output/' );

const jsonFiles = {
	'os_regions/overview': osRegionsJson.createOverview(),
	'sector_teams/index': sectorTeamsJson.createIndex(),
	'sector_teams/overview': sectorTeamsJson.createOverview(),
	'shared/index': sharedJson.createIndex(),
	'shared/sector': sharedJson.createSector(),
	'shared/campaigns': sharedJson.createCampaigns(),
	'shared/months': sharedJson.createMonths(),
	'shared/top_non_hvcs': sharedJson.createTopNonHvcs()
};

writeJsonFiles( outputPath, jsonFiles );
