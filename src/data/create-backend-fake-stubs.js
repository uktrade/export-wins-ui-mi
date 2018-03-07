const path = require( 'path' );
const writeJsonFiles = require( './faker/helpers/write-json-files' );

const userJson = require( './faker/backend/scripts/lib/json-creators/user-json' );
const csvJson = require( './faker/backend/scripts/lib/json-creators/csv/csv-json' );

const hvcGroupsJson = require( './faker/backend/scripts/lib/json-creators/export/hvc-groups-json' );
const osRegionsJson = require( './faker/backend/scripts/lib/json-creators/export/os-regions-json' );
const osRegionGroupsJson = require( './faker/backend/scripts/lib/json-creators/export/os-region-groups-json' );
const sectorTeamsJson = require( './faker/backend/scripts/lib/json-creators/export/sector-teams-json' );
const sharedJson = require( './faker/backend/scripts/lib/json-creators/export/shared-json' );
const hvcJson = require( './faker/backend/scripts/lib/json-creators/export/hvc-json' );
const globalHvcsJson = require( './faker/backend/scripts/lib/json-creators/export/global-hvcs-json' );
const globalWinsJson = require( './faker/backend/scripts/lib/json-creators/export/global-wins-json' );
const countriesJson = require( './faker/backend/scripts/lib/json-creators/export/countries-json' );
const postsJson = require( './faker/backend/scripts/lib/json-creators/export/posts-json' );
const ukRegionJson = require( './faker/backend/scripts/lib/json-creators/export/uk-regions-json' );

const fdiSectorTeamsJson = require( './faker/backend/scripts/lib/json-creators/investment/fdi/sector-teams-json' );
const fdiOsRegionsJson = require( './faker/backend/scripts/lib/json-creators/investment/fdi/os-regions-json' );
const fdiUkRegionsJson = require( './faker/backend/scripts/lib/json-creators/investment/fdi/uk-regions-json' );
const fdiPerformanceJson = require( './faker/backend/scripts/lib/json-creators/investment/fdi/performance-json' );


const outputPath = path.resolve( __dirname, 'fake-stubs/backend' );

const years = [ 2016, 2017 ];

const jsonFiles = {

	'user/me': userJson.createMe(),
	'/csv/all_files': csvJson.createList()
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
	'uk_regions/overview': ukRegionJson.createOverview,
	'uk_regions/region': ukRegionJson.createRegion,
	'uk_regions/months': ukRegionJson.createMonths,
	'uk_regions/top_non_hvcs': sharedJson.createTopNonHvcs,
	'uk_regions/win_table': ukRegionJson.createWinTable,

	'investment/fdi/performance/index': fdiPerformanceJson.index,
	'investment/fdi/performance/tab.sectors': fdiPerformanceJson.tab,

	'investment/fdi/sector_teams/index': fdiSectorTeamsJson.createIndex,
	'investment/fdi/sector_teams/win_table': fdiSectorTeamsJson.createWinTable,

	'investment/fdi/os_regions/index': fdiOsRegionsJson.createIndex,
	'investment/fdi/uk_regions/index': fdiUkRegionsJson.createIndex
};

for( let file in yearlyFiles ){

	const generateJson = yearlyFiles[ file ];

	for( let year of years ){

		jsonFiles[ `${ file }.${ year }` ] = generateJson( year );
	}
}

writeJsonFiles( outputPath, jsonFiles );
