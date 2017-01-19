const isSectorTeamsOverview = /^\/mi\/sector_teams\/overview\/$/;
const isSectorTeamTopNonHvc = /^\/mi\/sector_teams\/[0-9]+\/top_non_hvcs\/$/;
const isSectorTeamCampaign = /^\/mi\/sector_teams\/[0-9]+\/campaigns\/$/;
const isSectorTeamMonths = /^\/mi\/sector_teams\/[0-9]+\/months\/$/;
const isSectorTeam = /^\/mi\/sector_teams\/[0-9]+\/$/;
const isSectorTeams = /^\/mi\/sector_teams\/$/;

const isOverseasRegionTopNonHvc = /^\/mi\/os_regions\/[0-9]+\/top_non_hvcs\/$/;
const isOverseasRegionCampaigns = /^\/mi\/os_regions\/[0-9]+\/campaigns\/$/;
const isOverseasRegionMonths = /^\/mi\/os_regions\/[0-9]+\/months\/$/;
const isOverseasRegion = /^\/mi\/os_regions\/[0-9]+\/$/;
const isOverseasRegions = /^\/mi\/os_regions\/$/;
const isOverseasRegionOverview = /^\/mi\/os_regions\/overview\/$/;

const isParentSectors = /^\/mi\/parent_sectors\/$/;
const isParentSector = /^\/mi\/parent_sectors\/[0-9]+\/$/;
const isParentCampaigns = /^\/mi\/parent_sectors\/[0-9]+\/campaigns\/$/;
const isParentMonths = /^\/mi\/parent_sectors\/[0-9]+\/months\/$/;
const isParentTopNonHvcs = /^\/mi\/parent_sectors\/[0-9]+\/top_non_hvcs\/$/;


const sectorTeamsOverviewStub = require( '../../stubs/backend/sector_teams/overview' );
const SectorTeamTopNonHvcStub = require( '../../stubs/backend/sector_teams/top_non_hvcs' );
const sectorTeamCampaignStub = require( '../../stubs/backend/sector_teams/campaigns' );
const sectorTeamMonthsStub = require( '../../stubs/backend/sector_teams/months_2016-12-12' );
const sectorTeamStub = require( '../../stubs/backend/sector_teams/sector_team_v2' );
const sectorTeamsStub = require( '../../stubs/backend/sector_teams/' );

const overseasRegionTopNonHvcStub = require( '../../stubs/backend/os_regions/top_non_hvcs' );
const overseasRegionCampaignsStub = require( '../../stubs/backend/os_regions/campaigns' );
const overseasRegionMonthsStub = require( '../../stubs/backend/os_regions/months' );
const overseasRegionStub = require( '../../stubs/backend/os_regions/region' );
const overseasRegionsStub = require( '../../stubs/backend/os_regions/' );
const overseasRegionsOverviewStub = require( '../../stubs/backend/os_regions/overview' );

const parentSectorsStub = require( '../../stubs/backend/parent_sectors' );
const parentSectorStub = require( '../../stubs/backend/parent_sector' );
const parentCampaignsStub = require( '../../stubs/backend/parent_sector_campaigns' );
const parentMonthsStub = require( '../../stubs/backend/parent_sector_months' );
const parentTopNonHvcsStub = require( '../../stubs/backend/parent_sector_top_non_hvcs' );

const response = { statusCode: 200, isSuccess: true };

const stubs = [

	[ isSectorTeamsOverview, sectorTeamsOverviewStub ],
	[ isSectorTeamTopNonHvc, SectorTeamTopNonHvcStub ],
	[ isSectorTeamCampaign, sectorTeamCampaignStub ],
	[ isSectorTeamMonths, sectorTeamMonthsStub ],
	[ isSectorTeam, sectorTeamStub ],
	[ isSectorTeams, sectorTeamsStub ],

	[ isOverseasRegionTopNonHvc, overseasRegionTopNonHvcStub ],
	[ isOverseasRegionCampaigns, overseasRegionCampaignsStub ],
	[ isOverseasRegionMonths, overseasRegionMonthsStub ],
	[ isOverseasRegion, overseasRegionStub ],
	[ isOverseasRegions, overseasRegionsStub ],
	[ isOverseasRegionOverview, overseasRegionsOverviewStub ],

	[ isParentSectors, parentSectorsStub ],
	[ isParentSector, parentSectorStub ],
	[ isParentCampaigns, parentCampaignsStub ],
	[ isParentMonths, parentMonthsStub ],
	[ isParentTopNonHvcs, parentTopNonHvcsStub ]
];

module.exports = {

	get: function( alice, url, cb ){

		let data;
		let path;
		let stub;

		for( [ path, stub ] of stubs ){

			if( path.test( url ) ){

				data = stub;
				break;
			}
		}

		if( data ){

			cb( null, response, data );

		} else {

			cb( new Error( 'Stub not matched' ) );
		}
	}
};
