const path = require( 'path' );
const writeJsonFiles = require( './faker/helpers/write-json-files' );

const hvcGroupsJson = require( './faker/backend/scripts/hvc-groups-json' );
const osRegionsJson = require( './faker/backend/scripts/os-regions-json' );
const osRegionGroupsJson = require( './faker/backend/scripts/os-region-groups-json' );
const sectorTeamsJson = require( './faker/backend/scripts/sector-teams-json' );
const sharedJson = require( './faker/backend/scripts/shared-json' );
const userJson = require( './faker/backend/scripts/user-json' );
const hvcJson = require( './faker/backend/scripts/hvc-json' );

const outputPath = path.resolve( __dirname, 'fake-stubs/backend' );

const jsonFiles = {

	'user/me': userJson.createMe(),

	'hvc/hvc': hvcJson.createHvc(),
	'hvc/win_table': sharedJson.createWinTable(),

	'hvc_groups/index': sharedJson.createIndex(),
	'hvc_groups/group': sharedJson.createSector(),
	'hvc_groups/campaigns': sharedJson.createCampaigns(),
	'hvc_groups/months': hvcGroupsJson.createMonths(),

	'os_regions/overview': osRegionsJson.createOverview(),
	'os_regions/campaigns': sharedJson.createCampaigns(),
	'os_regions/index': osRegionsJson.createList(),
	'os_regions/months': sharedJson.createMonths(),
	'os_regions/region': sharedJson.createSector(),
	'os_regions/top_non_hvcs': sharedJson.createTopNonHvcs(),

	'os_region_groups/index.2016': osRegionGroupsJson.createList(),
	'os_region_groups/index.2017': osRegionGroupsJson.createList(),

	'sector_teams/index': sectorTeamsJson.createIndex(),
	'sector_teams/overview': sectorTeamsJson.createOverview(),
	'sector_teams/sector_team': sharedJson.createSector(),
	'sector_teams/campaigns': sharedJson.createCampaigns(),
	'sector_teams/months': sharedJson.createMonths(),
	'sector_teams/top_non_hvcs': sharedJson.createTopNonHvcs()
};

writeJsonFiles( outputPath, jsonFiles );
