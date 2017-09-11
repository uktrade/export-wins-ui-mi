const path = require( 'path' );
const writeJsonFiles = require( './faker/helpers/write-json-files' );

const hvcGroupsJson = require( './faker/backend/scripts/lib/json-creators/hvc-groups-json' );
const osRegionsJson = require( './faker/backend/scripts/lib/json-creators/os-regions-json' );
const osRegionGroupsJson = require( './faker/backend/scripts/lib/json-creators/os-region-groups-json' );
const sectorTeamsJson = require( './faker/backend/scripts/lib/json-creators/sector-teams-json' );
const sharedJson = require( './faker/backend/scripts/lib/json-creators/shared-json' );
const userJson = require( './faker/backend/scripts/lib/json-creators/user-json' );
const hvcJson = require( './faker/backend/scripts/lib/json-creators/hvc-json' );
const globalHvcsJson = require( './faker/backend/scripts/lib/json-creators/global-hvcs-json' );
const globalWinsJson = require( './faker/backend/scripts/lib/json-creators/global-wins-json' );
const countriesJson = require( './faker/backend/scripts/lib/json-creators/countries-json' );
const postsJson = require( './faker/backend/scripts/lib/json-creators/posts-json' );
const ukRegionJson = require( './faker/backend/scripts/lib/json-creators/uk-regions-json' );

const outputPath = path.resolve( __dirname, 'fake-stubs/backend' );

const years = [ 2016, 2017 ];

const jsonFiles = {

	'user/me': userJson.createMe()
};

const yearlyFiles = {

	'global_hvcs/index': globalHvcsJson.createHvcs,
	'global_wins/index': globalWinsJson.createWins,

	'hvc/hvc': hvcJson.createHvc,
	'hvc/top_wins': sharedJson.createTopNonHvcs,
	'hvc/win_table': hvcJson.createWinTable,

	'hvc_groups/index': sharedJson.createIndex,
	'hvc_groups/group': sharedJson.createSector,
	'hvc_groups/campaigns': sharedJson.createCampaigns,
	'hvc_groups/months': hvcGroupsJson.createMonths,
	'hvc_groups/win_table': hvcGroupsJson.createWinTable,

	'os_regions/overview': osRegionsJson.createOverview,
	'os_regions/campaigns': sharedJson.createCampaigns,
	'os_regions/index': osRegionsJson.createList,
	'os_regions/months': sharedJson.createMonths,
	'os_regions/region': sharedJson.createSector,
	'os_regions/top_non_hvcs': sharedJson.createTopNonHvcs,
	'os_regions/win_table': osRegionsJson.createWinTable,

	'os_region_groups/index': osRegionGroupsJson.createList,

	'sector_teams/index': sectorTeamsJson.createIndex,
	'sector_teams/overview': sectorTeamsJson.createOverview,
	'sector_teams/sector_team': sharedJson.createSector,
	'sector_teams/campaigns': sharedJson.createCampaigns,
	'sector_teams/months': sharedJson.createMonths,
	'sector_teams/top_non_hvcs': sharedJson.createTopNonHvcs,
	'sector_teams/win_table': sectorTeamsJson.createWinTable,

	'countries/index': countriesJson.createList,
	'countries/country': sharedJson.createSector,
	'countries/campaigns': sharedJson.createCampaigns,
	'countries/months': sharedJson.createMonths,
	'countries/top_non_hvcs': sharedJson.createTopNonHvcs,
	'countries/win_table': countriesJson.createWinTable,

	'posts/index': postsJson.createList,
	'posts/post': sharedJson.createSector,
	'posts/campaigns': sharedJson.createCampaigns,
	'posts/months': sharedJson.createMonths,
	'posts/top_non_hvcs': sharedJson.createTopNonHvcs,
	'posts/win_table': postsJson.createWinTable,

	'uk_regions/index': ukRegionJson.createList,
	'uk_regions/region': ukRegionJson.createRegion,
	'uk_regions/months': ukRegionJson.createMonths,
	'uk_regions/top_non_hvcs': sharedJson.createTopNonHvcs,
	'uk_regions/win_table': ukRegionJson.createWinTable,
};

for( let file in yearlyFiles ){

	const generateJson = yearlyFiles[ file ];

	for( let year of years ){

		jsonFiles[ `${ file }.${ year }` ] = generateJson( year );
	}
}

writeJsonFiles( outputPath, jsonFiles );
