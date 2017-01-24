
const config = require( '../../config' );

const USE_MOCKS = config.backend.mock;
const USE_STUBS = config.backend.stub;

const logger = require( '../logger' );
const backend = ( USE_STUBS ? require( '../backend.stub' ) : require( '../backend' ) );
const mocks = ( USE_MOCKS ? require( '../../../mocks' ) : null );

const transformMonths = require( '../transformers/months' );
const transformCampaigns = require( '../transformers/campaigns' );
const transformSectorTeam = require( '../transformers/sector-team' );
const transformSectorTeamsOverview = require( '../transformers/sector-teams-overview' );
const transformOverseasRegionsOverview = require( '../transformers/os-regions-overview' );
const transformHvcGroup = require( '../transformers/hvc-group' );


if( USE_STUBS ){

	logger.warn( 'Using stubs for backend service' );
}


function get( alice, path ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( alice, path, function( err, response, data ){

			if( err ){

				if( err.code === 'ECONNREFUSED' ){ 

					err = new Error( 'The backend is not available.' );
				}

				reject( err );

			} else {

				if( response.isSuccess ){

					resolve( data );

				} else {

					logger.error( 'Got a %s status code for url: %s', response.statusCode, response.request.uri.href );
					reject( new Error( 'Not a successful response from the backend.' ) );
				}
			}
		} );
	} );
}

function getSectorTeams( alice ){

	return get( alice, '/mi/sector_teams/' );
}

function getSectorTeam( alice, teamId ){

	return get( alice, `/mi/sector_teams/${ teamId }/` ).then( ( data ) => transformSectorTeam( data ) );
}

function getSectorTeamMonths( alice, teamId ){

	return get( alice, `/mi/sector_teams/${ teamId }/months/` ).then( ( data ) => transformMonths( data ) );
}

function getSectorTeamCampaigns( alice, teamId ){

	return get( alice, `/mi/sector_teams/${ teamId }/campaigns/` ).then( ( data ) => transformCampaigns( data ) );
}

function getSectorTeamTopNonHvc( alice, teamId ){

	return get( alice, `/mi/sector_teams/${ teamId }/top_non_hvcs/` );
}

function getSectorTeamsOverview( alice ){

	return get( alice, '/mi/sector_teams/overview/' ).then( ( data ) => transformSectorTeamsOverview( data ) );	
}


function getOverseasRegions( alice ){

	return get( alice, '/mi/os_regions/' );
}

function getOverseasRegionName( alice, regionId ){

	return getOverseasRegions( alice ).then( ( regions ) => {

		let regionName;

		for( let region of regions ){

			if( region.id == regionId ){

				regionName = region.name;
				break;
			}
		}

		if( regionName ){

			return regionName;

		} else {

			throw new Error( 'Region not found' );
		}

	});
}

function getOverseasRegion( alice, regionId ){

	return get( alice, `/mi/os_regions/${ regionId }/` );
}

function getOverseasRegionMonths( alice, regionId ){

	return get( alice, `/mi/os_regions/${ regionId }/months/` ).then( ( data ) => transformMonths( data ) );
}

function getOverseasRegionTopNonHvc( alice, regionId ){

	return get( alice, `/mi/os_regions/${ regionId }/top_non_hvcs/` );
}

function getOverseasRegionCampaigns( alice, regionId ){

	return get( alice, `/mi/os_regions/${ regionId }/campaigns/` ).then( ( data ) => transformCampaigns( data ) );
}

function getOverseasRegionsOverview( alice ){

	return get( alice, '/mi/os_regions/overview/' ).then( ( data ) => transformOverseasRegionsOverview( data ) );
}


function getHvcGroups( alice ){

	return get( alice, '/mi/hvc_groups/' );
}

function getHvcGroup( alice, groupId ){

	return get( alice, `/mi/hvc_groups/${ groupId }/` ).then( ( data ) => transformHvcGroup( data ) );
}

function getHvcGroupCampaigns( alice, groupId ){

	return get( alice, `/mi/hvc_groups/${ groupId }/campaigns/` ).then( ( data ) => transformCampaigns( data ) );
}

function getHvcGroupMonths( alice, groupId ){

	return get( alice, `/mi/hvc_groups/${ groupId }/months/` ).then( ( data ) => transformMonths( data ) );
}


/*eslint-disable no-func-assign */
if( USE_MOCKS ){

	logger.warn( 'Using mocks for backend service' );

	getSectorTeamCampaigns = mocks.sectorTeamCampaigns;
	getSectorTeamTopNonHvc = mocks.sectorTeamTopNonHvc;
	getSectorTeamMonths = mocks.sectorTeamMonths;
	getSectorTeamsOverview = mocks.sectorTeamsOverview;

	getOverseasRegionsOverview = mocks.regionsOverview;
}
/*eslint-enable no-func-assign */


module.exports = {

	getSectorTeams,
	getSectorTeam,
	getSectorTeamMonths,
	getSectorTeamCampaigns,
	getSectorTeamTopNonHvc,

	getSectorTeamInfo: function( alice, teamId ){

		return Promise.all( [

			getSectorTeam( alice, teamId ),
			getSectorTeamMonths( alice, teamId ),
			getSectorTeamTopNonHvc( alice, teamId ),
			getSectorTeamCampaigns( alice, teamId )
		] );
	},

	getSectorTeamsOverview,

	getOverseasRegions,
	getOverseasRegion,
	getOverseasRegionMonths,
	getOverseasRegionTopNonHvc,
	getOverseasRegionCampaigns,
	getOverseasRegionName,

	getOverseasRegionInfo: function( alice, regionId ){

		return Promise.all( [

			getOverseasRegionName( alice, regionId ),
			getOverseasRegion( alice, regionId ),
			getOverseasRegionMonths( alice, regionId ),
			getOverseasRegionTopNonHvc( alice, regionId ),
			getOverseasRegionCampaigns( alice, regionId )
		] );
	},

	getSectorTeamsAndOverseasRegions: function( alice ){

		return Promise.all( [

			getSectorTeams( alice ),
			getOverseasRegions( alice )
		] );
	},

	getOverseasRegionsOverview,

	getHvcGroups,

	getHvcGroupInfo: function( alice, parentId ){

		return Promise.all( [

			getHvcGroup( alice, parentId ),
			getHvcGroupMonths( alice, parentId ),
			getHvcGroupCampaigns( alice, parentId )
		] );
	}
};
