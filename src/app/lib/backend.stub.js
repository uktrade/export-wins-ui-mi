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

const response = { statusCode: 200, isSuccess: true };

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

const stubs = [

	[ isSectorTeamTopNonHvc, topNonHvcStub ],
	[ isSectorTeamCampaign, sectorTeamCampaignStub ],
	[ isSectorTeamMonths, sectorTeamMonthsStub ],
	[ isSectorTeam, sectorTeamStub ],
	[ isSectorTeams, sectorTeamsStub ],

	[ isRegionTopNonHvc, regionTopNonHvcStub ],
	[ isRegionCampaigns, regionCampaignsStub ],
	[ isRegionMonths, regionMonthsStub ],
	[ isRegion, regionStub ],
	[ isRegions, regionsStub ]
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
