const config = require( '../../../config' );
const { getAll, getJson } = require( './_helpers' );

const USE_MOCKS = config.backend.mock;

const mocks = ( USE_MOCKS ? require( '../../../../data/mocks' ) : null );

const transformMonths = require( '../../transformers/export/months' );
const transformMonthsForVolume = require( '../../transformers/export/months-volume' );
const transformCampaigns = require( '../../transformers/export/campaigns' );
const transformSectorTeamsOverview = require( '../../transformers/export/sector-teams-overview' );
const transformOverseasRegionsOverview = require( '../../transformers/export/os-regions-overview' );
const transformHvcGroup = require( '../../transformers/export/hvc-group' );
const transformWinList = require( '../../transformers/export/win-list' );
const transformAlphabeticalList = require( '../../transformers/export/alphabetical-list' );
//let for testing :-(
let transformOverseasRegionsOverviewGroups = require( '../../transformers/export/os-regions-overview-groups' );


function getSectorTeams( req ){

	return getJson( '/mi/sector_teams/', req );
}

function getSectorTeam( req, teamId ){

	return getJson( `/mi/sector_teams/${ teamId }/`, req );
}

function getSectorTeamMonths( req, teamId ){

	return getJson( `/mi/sector_teams/${ teamId }/months/`, req, transformMonths );
}

function getSectorTeamCampaigns( req, teamId ){

	return getJson( `/mi/sector_teams/${ teamId }/campaigns/`, req, transformCampaigns );
}

function getSectorTeamTopNonHvc( req, teamId ){

	return getJson( `/mi/sector_teams/${ teamId }/top_non_hvcs/`, req );
}

function getSectorTeamWinTable( req, teamId ){

	return getJson( `/mi/sector_teams/${ teamId }/win_table/`, req, transformWinList );
}

function getSectorTeamsOverview( req ){

	return getJson( '/mi/sector_teams/overview/', req, transformSectorTeamsOverview );
}


function getCountries( req ){

	return getJson( '/mi/countries/', req, transformAlphabeticalList );
}

function getCountry( req, countryCode ){

	return getJson( `/mi/countries/${ countryCode }/`, req );
}

function getCountryCampaigns( req, countryCode ){

	return getJson( `/mi/countries/${ countryCode }/campaigns/`, req, transformCampaigns );
}

function getCountryMonths( req, countryCode ){

	return getJson( `/mi/countries/${ countryCode }/months/`, req, transformMonths );
}

function getCountryTopNonHvc( req, countryCode ){

	return getJson( `/mi/countries/${ countryCode }/top_non_hvcs/`, req );
}

function getCountryWinTable( req, countryCode ){

	return getJson( `/mi/countries/${ countryCode }/win_table/`, req, transformWinList );
}


function getPosts( req ){

	return getJson( '/mi/posts/', req, transformAlphabeticalList );
}

function getPost( req, postId ){

	return getJson( `/mi/posts/${ postId }/`, req );
}

function getPostCampaigns( req, postId ){

	return getJson( `/mi/posts/${ postId }/campaigns/`, req, transformCampaigns );
}

function getPostMonths( req, postId ){

	return getJson( `/mi/posts/${ postId }/months/`, req, transformMonths );
}

function getPostTopNonHvc( req, postId ){

	return getJson( `/mi/posts/${ postId }/top_non_hvcs/`, req );
}

function getPostWinTable( req, postId ){

	return getJson( `/mi/posts/${ postId }/win_table/`, req, transformWinList );
}


function getUkRegions( req ){

	return getJson( '/mi/uk_regions/', req );
}

function getUkRegionsOverview( req ){

	return getJson( '/mi/uk_regions/overview/', req );
}

function getUkRegion( req, postId ){

	return getJson( `/mi/uk_regions/${ postId }/`, req );
}

function getUkRegionMonths( req, postId ){

	return getJson( `/mi/uk_regions/${ postId }/months/`, req, transformMonthsForVolume );
}

function getUkRegionTopNonHvc( req, postId ){

	return getJson( `/mi/uk_regions/${ postId }/top_non_hvcs/`, req );
}

function getUkRegionWinTable( req, postId ){

	return getJson( `/mi/uk_regions/${ postId }/win_table/`, req, transformWinList );
}


function getOverseasRegions( req ){

	return getJson( '/mi/os_regions/', req );
}

function getOverseasRegionGroups( req ){

	return getJson( '/mi/os_region_groups/', req );
}

function getOverseasRegion( req, regionId ){

	return getJson( `/mi/os_regions/${ regionId }/`, req );
}

function getOverseasRegionMonths( req, regionId ){

	return getJson( `/mi/os_regions/${ regionId }/months/`, req, transformMonths );
}

function getOverseasRegionCampaigns( req, regionId ){

	return getJson( `/mi/os_regions/${ regionId }/campaigns/`, req, transformCampaigns );
}

function getOverseasRegionTopNonHvc( req, regionId ){

	return getJson( `/mi/os_regions/${ regionId }/top_non_hvcs/`, req );
}

function getOverseasRegionWinTable( req, regionId ){

	return getJson( `/mi/os_regions/${ regionId }/win_table/`, req, transformWinList );
}

function getOverseasRegionsOverview( req ){

	return getJson( '/mi/os_regions/overview/', req, transformOverseasRegionsOverview );
}


function getHvc( req, hvcId ){

	return getJson( `/mi/hvc/${ hvcId }/`, req );
}

function getHvcMarkets( req, hvcId ){

	return getJson( `/mi/hvc/${ hvcId }/top_wins/`, req );
}

function getHvcWinList( req, hvcId ){

	return getJson( `/mi/hvc/${ hvcId }/win_table/`, req, transformWinList );
}


function getGlobalHvcs( req ){

	return getJson( '/mi/global_hvcs/', req );
}

function getGlobalWins( req ){

	return getJson( '/mi/global_wins/', req );
}


function getHvcGroups( req ){

	return getJson( '/mi/hvc_groups/', req );
}

function getHvcGroup( req, groupId ){

	return getJson( `/mi/hvc_groups/${ groupId }/`, req, transformHvcGroup );
}

function getHvcGroupCampaigns( req, groupId ){

	return getJson( `/mi/hvc_groups/${ groupId }/campaigns/`, req, transformCampaigns );
}

function getHvcGroupMonths( req, groupId ){

	return getJson( `/mi/hvc_groups/${ groupId }/months/`, req, transformMonths );
}

function getHvcGroupWinTable( req, groupId ){

	return getJson( `/mi/hvc_groups/${ groupId }/win_table/`, req, transformWinList );
}


function getWin(){

	return mocks.win();
}

module.exports = {

	getSectorTeams,
	getSectorTeam,
	getSectorTeamMonths,
	getSectorTeamCampaigns,
	getSectorTeamTopNonHvc,
	getSectorTeamWinTable,

	getSectorTeamInfo: function( req, teamId ){

		return getAll( 'getSectorTeamInfo', [

			getSectorTeam( req, teamId ),
			getSectorTeamMonths( req, teamId ),
			getSectorTeamTopNonHvc( req, teamId ),
			getSectorTeamCampaigns( req, teamId )

		], function( data ){

			return {
				wins: data[ 0 ],
				months: data[ 1 ],
				topNonHvc: data[ 2 ],
				campaigns: data[ 3 ]
			};
		} );
	},

	getSectorTeamsOverview,

	getCountries,
	getCountry,
	getCountryCampaigns,
	getCountryMonths,
	getCountryTopNonHvc,
	getCountryWinTable,

	getCountryInfo: function( req, countryId ){

		return getAll( 'getCountryInfo', [

			getCountry( req, countryId ),
			getCountryMonths( req, countryId ),
			getCountryTopNonHvc( req, countryId ),
			getCountryCampaigns( req, countryId )

		], function( data ){

			return {
				wins: data[ 0 ],
				months: data[ 1 ],
				topNonHvc: data[ 2 ],
				campaigns: data[ 3 ]
			};
		} );
	},

	getPosts,
	getPost,
	getPostCampaigns,
	getPostMonths,
	getPostTopNonHvc,
	getPostWinTable,

	getPostInfo: function( req, postId ){

		return getAll( 'getPostInfo', [

			getPost( req, postId ),
			getPostMonths( req, postId ),
			getPostTopNonHvc( req, postId ),
			getPostCampaigns( req, postId )

		], function( data ){

			return {
				wins: data[ 0 ],
				months: data[ 1 ],
				topNonHvc: data[ 2 ],
				campaigns: data[ 3 ]
			};
		} );
	},

	getUkRegions,
	getUkRegionsOverview,
	getUkRegion,
	getUkRegionMonths,
	getUkRegionTopNonHvc,
	getUkRegionWinTable,

	getUkRegionInfo: function( req, regionId ){

		return getAll( 'getUkRegionInfo', [

			getUkRegion( req, regionId ),
			getUkRegionTopNonHvc( req, regionId ),
			getUkRegionMonths( req, regionId )

		], function( data ){

			return {
				wins: data[ 0 ],
				topNonHvc: data[ 1 ],
				months: data[ 2 ]
			};
		} );
	},

	getOverseasRegions,
	getOverseasRegionGroups,
	getOverseasRegion,
	getOverseasRegionMonths,
	getOverseasRegionCampaigns,
	getOverseasRegionTopNonHvc,
	getOverseasRegionWinTable,

	getOverseasRegionInfo: function( req, regionId ){

		return getAll( 'getOverseasRegionInfo', [

			getOverseasRegion( req, regionId ),
			getOverseasRegionMonths( req, regionId ),
			getOverseasRegionTopNonHvc( req, regionId ),
			getOverseasRegionCampaigns( req, regionId )

		], function( data ){

			return {
				wins: data[ 0 ],
				months: data[ 1 ],
				topNonHvc: data[ 2 ],
				campaigns: data[ 3 ]
			};
		} );
	},

	getHomepageData: function( req ){

		return getAll( 'getHomepageData', [

			getSectorTeams( req ),
			getOverseasRegionGroups( req ),
			getGlobalHvcs( req ),
			getGlobalWins( req ),
			getUkRegions( req )

		], function( data ){

			return {
				sectorTeams: data[ 0 ],
				overseasRegionGroups: data[ 1 ],
				globalHvcs: data[ 2 ],
				globalWins: data[ 3 ],
				ukRegions: data[ 4 ]
			};
		} );
	},

	getOverseasRegionsOverview,
	getOverseasRegionsOverviewGroups: function( req ){

		return getAll( 'getOverseasRegionsOverviewGroups', [

			getOverseasRegionGroups( req ),
			getOverseasRegionsOverview( req )

		], function( data ){

			const groups = data[ 0 ];
			const regions = data[ 1 ];

			const out = transformOverseasRegionsOverviewGroups( groups, regions );

			return out;
		} );
	},

	getHvc,
	getHvcMarkets,
	getHvcWinList,

	getGlobalHvcs,
	getGlobalWins,

	getHvcInfo: function( req, hvcId ){

		return getAll( 'getHvcInfo', [

			getHvc( req, hvcId ),
			getHvcMarkets( req, hvcId )

			], function( data ){

			return {

				hvc: data[ 0 ],
				markets: data[ 1 ]
			};
		} );
	},

	getHvcGroups,
	getHvcGroup,
	getHvcGroupMonths,
	getHvcGroupCampaigns,
	getHvcGroupWinTable,

	getHvcGroupInfo: function( req, parentId ){

		return getAll( 'getHvcGroupInfo', [

			getHvcGroup( req, parentId ),
			getHvcGroupMonths( req, parentId ),
			getHvcGroupCampaigns( req, parentId )

		], function( data ){

			return {
				wins: data[ 0 ],
				months: data[ 1 ],
				campaigns: data[ 2 ]
			};
		} );
	},

	getWin
};
