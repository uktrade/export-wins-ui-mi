const isSectorTeamsOverview = /^\/mi\/sector_teams\/overview\/$/;
const isSectorTeamTopNonHvc = /^\/mi\/sector_teams\/[0-9]+\/top_non_hvcs\/$/;
const isSectorTeamCampaign = /^\/mi\/sector_teams\/[0-9]+\/campaigns\/$/;
const isSectorTeamMonths = /^\/mi\/sector_teams\/[0-9]+\/months\/$/;
const isSectorTeam = /^\/mi\/sector_teams\/[0-9]+\/$/;
const isSectorTeams = /^\/mi\/sector_teams\/$/;

const isRegionTopNonHvc = /^\/mi\/regions\/[0-9]+\/top_non_hvcs\/$/;
const isRegionCampaigns = /^\/mi\/regions\/[0-9]+\/campaigns\/$/;
const isRegionMonths = /^\/mi\/regions\/[0-9]+\/months\/$/;
const isRegion = /^\/mi\/regions\/[0-9]+\/$/;
const isRegions = /^\/mi\/regions\/$/;

const isParentSectors = /^\/mi\/parent_sectors\/$/;
const isParentSector = /^\/mi\/parent_sectors\/[0-9]+\/$/;
const isParentCampaigns = /^\/mi\/parent_sectors\/[0-9]+\/campaigns\/$/;
const isParentMonths = /^\/mi\/parent_sectors\/[0-9]+\/months\/$/;
const isParentTopNonHvcs = /^\/mi\/parent_sectors\/[0-9]+\/top_non_hvcs\/$/;


const response = { statusCode: 200, isSuccess: true };

const sectorTeamsOverviewStub = require( '../../stubs/backend/sector_teams_overview' );
const topNonHvcStub = require( '../../stubs/backend/top_non_hvc_2016-12-12' );
const sectorTeamCampaignStub = require( '../../stubs/backend/sector_team_campaigns_2016-12-12' );
const sectorTeamMonthsStub = require( '../../stubs/backend/sector_team_months_2016-12-12' );
const sectorTeamStub = require( '../../stubs/backend/sector_team_v2' );
const sectorTeamsStub = require( '../../stubs/backend/sector_teams' );

const regionTopNonHvcStub = require( '../../stubs/backend/region_top_non_hvc' );
const regionCampaignsStub = require( '../../stubs/backend/region_campaigns' );
const regionMonthsStub = require( '../../stubs/backend/region_months' );
const regionStub = require( '../../stubs/backend/region' );
const regionsStub = require( '../../stubs/backend/regions' );

const parentSectorsStub = require( '../../stubs/backend/parent_sectors' );
const parentSectorStub = require( '../../stubs/backend/parent_sector' );
const parentCampaignsStub = require( '../../stubs/backend/parent_sector_campaigns' );
const parentMonthsStub = require( '../../stubs/backend/parent_sector_months' );
const parentTopNonHvcsStub = require( '../../stubs/backend/parent_sector_top_non_hvcs' );


const stubs = [

	[ isSectorTeamsOverview, sectorTeamsOverviewStub ],
	[ isSectorTeamTopNonHvc, topNonHvcStub ],
	[ isSectorTeamCampaign, sectorTeamCampaignStub ],
	[ isSectorTeamMonths, sectorTeamMonthsStub ],
	[ isSectorTeam, sectorTeamStub ],
	[ isSectorTeams, sectorTeamsStub ],

	[ isRegionTopNonHvc, regionTopNonHvcStub ],
	[ isRegionCampaigns, regionCampaignsStub ],
	[ isRegionMonths, regionMonthsStub ],
	[ isRegion, regionStub ],
	[ isRegions, regionsStub ],

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
