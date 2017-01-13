
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

if( USE_STUBS ){

	logger.warn( 'Using stubs for backend service' );
}

/*
	/sector-teams/
	/sector-teams/{teamId}/
	/sector-teams/{teamId}/months/
	/sector-teams/{teamId}/overseas_regions/
	/sector-teams/{teamId}/campaigns => HVC target performance
	/top_non_hvcs => top 5 non HVC
*/

function createHandler( resolve, reject ){

	return function( err, response, data ){

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
	};
}

function getSectorTeams( alice ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( alice, '/mi/sector_teams/', createHandler( resolve, reject ) );
	} );
}

function getSectorTeam( alice, teamId ){

	return ( new Promise( ( resolve, reject ) => {
		
		backend.get( alice, `/mi/sector_teams/${ teamId }/`, createHandler( resolve, reject ) );
		
	} ) ).then( ( data ) => transformSectorTeam( data ) );
}

function getSectorTeamMonths( alice, teamId ){

	return ( new Promise( ( resolve, reject ) => {
		
		backend.get( alice, `/mi/sector_teams/${ teamId }/months/`, createHandler( resolve, reject ) );

	} ) ).then( ( data ) => transformMonths( data ) );
}

function getSectorTeamCampaigns( alice, teamId ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( alice, `/mi/sector_teams/${ teamId }/campaigns/`, createHandler( resolve, reject ) );

	} ).then( ( data ) => transformCampaigns( data ) );
}

function getSectorTeamTopNonHvc( alice, teamId ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( alice, `/mi/sector_teams/${ teamId }/top_non_hvcs/`, createHandler( resolve, reject ) );
	} );
}

function getSectorTeamsOverview( alice ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( alice, '/mi/sector_teams/overview/', createHandler( resolve, reject ) );

	} ).then( ( data ) => transformSectorTeamsOverview( data ) );	
}


function getRegions( alice ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( alice, '/mi/regions/', createHandler( resolve, reject ) );
	} );
}

function getRegionName( alice, regionId ){

	return getRegions( alice ).then( ( regions ) => {

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
	} );
}

function getRegion( alice, regionId ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( alice, `/mi/regions/${ regionId }/`, createHandler( resolve, reject ) );
	} );
}

function getRegionMonths( alice, regionId ){

	return ( new Promise( ( resolve, reject ) => {
		
		backend.get( alice, `/mi/regions/${ regionId }/months/`, createHandler( resolve, reject ) );

	} ) ).then( ( data ) => transformMonths( data ) );
}

function getRegionTopNonHvc( alice, regionId ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( alice, `/mi/regions/${ regionId }/top_non_hvcs/`, createHandler( resolve, reject ) );
	} );
}

function getRegionCampaigns( alice, regionId ){

	return ( new Promise( ( resolve, reject ) => {
		
		backend.get( alice, `/mi/regions/${ regionId }/campaigns/`, createHandler( resolve, reject ) );

	} ) ).then( ( data ) => transformCampaigns( data ) );
}

function getRegionsOverview( /* alice */ ){

	try {
	
		return require( '../../../mocks' ).regionsOverview();

	} catch( e ){

		logger.warn( 'No mocks found' );

		return new Promise( ( resolve, reject ) => {
			
			reject( new Error( 'Unable to load mocks' ) );
		} );
	}
}


/*eslint-disable no-func-assign */
if( USE_MOCKS ){

	logger.warn( 'Using mocks for backend service' );

	getSectorTeamCampaigns = mocks.sectorTeamCampaigns;
	getSectorTeamTopNonHvc = mocks.sectorTeamTopNonHvc;
	getSectorTeamMonths = mocks.sectorTeamMonths;
	getSectorTeamsOverview = mocks.sectorTeamsOverview;
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

	getRegions,
	getRegion,
	getRegionMonths,
	getRegionTopNonHvc,
	getRegionCampaigns,

	getRegionInfo: function( alice, regionId ){

		return Promise.all( [

			getRegionName( alice, regionId ),
			getRegion( alice, regionId ),
			getRegionMonths( alice, regionId ),
			getRegionTopNonHvc( alice, regionId ),
			getRegionCampaigns( alice, regionId )
		] );
	},

	getSectorTeamsAndRegions: function( alice ){

		return Promise.all( [

			getSectorTeams( alice ),
			getRegions( alice )
		] );
	},

	getRegionsOverview
};
