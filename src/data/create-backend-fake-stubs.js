const path = require( 'path' );
const writeJsonFiles = require( './faker/helpers/write-json-files' );

const hvcGroupsJson = require( './faker/backend/scripts/hvc-groups-json' );
const osRegionsJson = require( './faker/backend/scripts/os-regions-json' );
const sectorTeamsJson = require( './faker/backend/scripts/sector-teams-json' );
const sharedJson = require( './faker/backend/scripts/shared-json' );

const outputPath = path.resolve( __dirname, 'fake-stubs/backend' );

const jsonFiles = {

	'hvc_groups/index': sharedJson.createIndex(),
	'hvc_groups/group': sharedJson.createSector(),
	'hvc_groups/campaigns': sharedJson.createCampaigns(),
	'hvc_groups/months': hvcGroupsJson.createMonths(),

	'os_regions/overview': osRegionsJson.createOverview(),
	'os_regions/campaigns': sharedJson.createCampaigns(),
	'os_regions/index': sharedJson.createIndex(),
	'os_regions/months': sharedJson.createMonths(),
	'os_regions/region': sharedJson.createSector(),
	'os_regions/top_non_hvcs': sharedJson.createTopNonHvcs(),

	'sector_teams/index': sectorTeamsJson.createIndex(),
	'sector_teams/overview': sectorTeamsJson.createOverview(),
	'sector_teams/sector_team': sharedJson.createSector(),
	'sector_teams/campaigns': sharedJson.createCampaigns(),
	'sector_teams/months': sharedJson.createMonths(),
	'sector_teams/top_non_hvcs': sharedJson.createTopNonHvcs()
};

writeJsonFiles( outputPath, jsonFiles );
