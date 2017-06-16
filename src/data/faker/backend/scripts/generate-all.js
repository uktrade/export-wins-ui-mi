const path = require( 'path' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

const osRegionsJson = require( './os-regions-json' );
const osRegionGroupsJson = require( './os-regions-groups-json' );
const sectorTeamsJson = require( './sector-teams-json' );
const sharedJson = require( './shared-json' );

const outputPath = path.resolve( __dirname, '../output/' );

const jsonFiles = {
	'os_regions/overview': osRegionsJson.createOverview(),
	'os_regions/index': osRegionsJson.createList(),
	'sector_teams/index': sectorTeamsJson.createIndex(),
	'sector_teams/overview': sectorTeamsJson.createOverview(),
	'shared/index': sharedJson.createIndex(),
	'shared/sector': sharedJson.createSector(),
	'shared/campaigns': sharedJson.createCampaigns(),
	'shared/months': sharedJson.createMonths(),
	'shared/top_non_hvcs': sharedJson.createTopNonHvcs(),
	'os_region_groups/index.2017': osRegionGroupsJson.createList(),
	'os_region_groups/index.2016': osRegionGroupsJson.createList()
};

writeJsonFiles( outputPath, jsonFiles );
