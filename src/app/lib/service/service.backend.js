
const config = require( '../../config' );

const USE_MOCKS = config.backend.mock;
const USE_STUBS = config.backend.stub;

const logger = require( '../logger' );
const backend = ( USE_STUBS ? require( '../backend.stub' ) : require( '../backend' ) );
const mocks = ( USE_MOCKS ? require( '../../../mocks' ) : null );

const transformMonths = require( '../transformers/sector-months' );
const transformCampaigns = require( '../transformers/sector-campaigns' );
const transformSectorTeam = require( '../transformers/sector-team' );

if( USE_STUBS ){

	logger.warn( 'Using stubs for backend service' );
}

/*
	/sector-teams/
	/sector-teams/{sectorId}/
	/sector-teams/{sectorId}/months/
	/sector-teams/{sectorId}/overseas_regions/
	/sector-teams/{sectorId}/campaigns => HVC target performance
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

function getSectors( alice ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( alice, '/mi/sector_teams/', createHandler( resolve, reject ) );
	} );
}

function getSector( alice, sectorId ){

	return ( new Promise( ( resolve, reject ) => {
		
		backend.get( alice, `/mi/sector_teams/${ sectorId }/`, createHandler( resolve, reject ) );
		
	} ) ).then( ( data ) => transformSectorTeam( data ) );
}

function getSectorMonths( alice, sectorId ){

	return ( new Promise( ( resolve, reject ) => {
		
		backend.get( alice, `/mi/sector_teams/${ sectorId }/months/`, createHandler( resolve, reject ) );

	} ) ).then( ( data ) => transformMonths( data ) );
}

function getHvcTargetPerformance( alice, sectorId ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( alice, `/mi/sector_teams/${ sectorId }/campaigns/`, createHandler( resolve, reject ) );

	} ).then( ( data ) => transformCampaigns( data ) );
}

function getTopNonHvcRegionsAndSectors( alice, sectorId ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( alice, `/mi/sector_teams/${ sectorId }/top_non_hvcs/`, createHandler( resolve, reject ) );
	} );
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

function getRegionHvcTargetPerformance( alice, regionId ){

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

	getHvcTargetPerformance = mocks.hvcTargetPerformance;
	getTopNonHvcRegionsAndSectors = mocks.topNonHvcRegionsAndSectors;
	getSectorMonths = mocks.sectorPerformance;
}
/*eslint-enable no-func-assign */


module.exports = {

	getSectors,
	getSector,
	getSectorMonths,
	getHvcTargetPerformance,
	getTopNonHvcRegionsAndSectors,

	getSectorInfo: function( alice, sectorId ){

		return Promise.all( [

			getSector( alice, sectorId ),
			getSectorMonths( alice, sectorId ),
			getTopNonHvcRegionsAndSectors( alice, sectorId ),
			getHvcTargetPerformance( alice, sectorId )
		] );
	},

	getRegions,
	getRegion,
	getRegionMonths,
	getRegionTopNonHvc,
	getRegionHvcTargetPerformance,

	getRegionInfo: function( alice, regionId ){

		return Promise.all( [

			getRegionName( alice, regionId ),
			getRegion( alice, regionId ),
			getRegionMonths( alice, regionId ),
			getRegionTopNonHvc( alice, regionId ),
			getRegionHvcTargetPerformance( alice, regionId )
		] );
	},

	getSectorsAndRegions: function( alice ){

		return Promise.all( [

			getSectors( alice ),
			getRegions( alice )
		] );
	},

	getRegionsOverview
};
