
const USE_MOCKS = false;
const USE_STUBS = true;

const backend = ( USE_STUBS ? require( '../backend.stub' ) : require( '../backend' ) );
const mocks = ( USE_MOCKS ? require( '../../../mocks' ) : null );
const transformMonths = require( '../transformers/sector-months' );
const transformCampaigns = require( '../transformers/sector-campaigns' );

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

			if( response.statusCode === 200 ){

				resolve( data );

			} else {

				reject( new Error( 'Not a successful response from the backend.' ) );
			}
		}
	};
}

function getSectors(){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( '/mi/sector_teams/', createHandler( resolve, reject ) );
	} );
}

function getSector( sectorId ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( `/mi/sector_teams/${ sectorId }/`, createHandler( resolve, reject ) );
	} );
}

function getSectorMonths( sectorId ){

	return ( new Promise( ( resolve, reject ) => {
		
		backend.get( `/mi/sector_teams/${ sectorId }/months/`, createHandler( resolve, reject ) );

	} ) ).then( ( data ) => transformMonths( data ) );
}

function getHvcTargetPerformance( sectorId ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( `/mi/sector_teams/${ sectorId }/campaigns/`, createHandler( resolve, reject ) );

	} ).then( ( data ) => transformCampaigns( data ) );
}

function getTopNonHvcRegionsAndSectors( sectorId ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( `/mi/sector_teams/${ sectorId }/top_non_hvcs/`, createHandler( resolve, reject ) );
	} );
}

function getRegion( regionId ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( `/mi/regions/${ regionId }/`, createHandler( resolve, reject ) );
	} );
}

function getRegionMonths( regionId ){

	return ( new Promise( ( resolve, reject ) => {
		
		backend.get( `/mi/regions/${ regionId }/months/`, createHandler( resolve, reject ) );

	} ) ).then( ( data ) => transformMonths( data ) );
}

function getRegionTopNonHvc( regionId ){

	return new Promise( ( resolve, reject ) => {
		
		backend.get( `/mi/regions/${ regionId }/top_non_hvcs/`, createHandler( resolve, reject ) );
	} );
}

function getRegionHvcTargetPerformance( regionId ){

	return ( new Promise( ( resolve, reject ) => {
		
		backend.get( `/mi/regions/${ regionId }/campaigns/`, createHandler( resolve, reject ) );

	} ) ).then( ( data ) => transformCampaigns( data ) );
}


/*eslint-disable no-func-assign */
if( USE_MOCKS ){

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

	getSectorInfo: function( sectorId ){

		return Promise.all( [

			getSector( sectorId ),
			getSectorMonths( sectorId ),
			getTopNonHvcRegionsAndSectors( sectorId ),
			getHvcTargetPerformance( sectorId )
		] );
	},

	getRegion,
	getRegionMonths,
	getRegionTopNonHvc,
	getRegionHvcTargetPerformance,

	getRegionInfo: function( regionId ){

		return Promise.all( [

			getRegion( regionId ),
			getRegionMonths( regionId ),
			getRegionTopNonHvc( regionId ),
			getRegionHvcTargetPerformance( regionId )
		] );
	},
};
