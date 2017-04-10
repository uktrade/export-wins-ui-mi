const config = require( '../../config' );

const USE_MOCKS = config.backend.mock;
const USE_STUBS = config.backend.stub;

const logger = require( '../logger' );
const reporter = require( '../reporter' );
const backend = ( USE_STUBS ? require( '../backend.stub' ) : require( '../backend' ) );
const mocks = ( USE_MOCKS ? require( '../../../data/mocks' ) : null );

const transformMonths = require( '../transformers/months' );
const transformCampaigns = require( '../transformers/campaigns' );
const transformSectorTeamsOverview = require( '../transformers/sector-teams-overview' );
const transformOverseasRegionsOverview = require( '../transformers/os-regions-overview' );
const transformHvcGroup = require( '../transformers/hvc-group' );
const transformOsRegions = require( '../transformers/os-regions' );


function get( alice, path, transform ){

	return new Promise( ( resolve, reject ) => {

		backend.get( alice, path, function( err, response, data ){

			if( err ){

				if( err.code === 'ECONNREFUSED' ){

					err = new Error( 'The backend is not available.' );
				}

				reject( err );

			} else {

				if( response.isSuccess ){

					if( transform ){

						try {

							data = transform( data );
							resolve( data );

						} catch ( e ){

							logger.error( 'Unable to transform API response for url: %s', response.request.uri.path );
							logger.error( e );
							reject( new Error( 'Unable to transform API response' ) );
						}

					} else {

						resolve( data );
					}

				} else {

					logger.error( 'Got a %s status code for url: %s', response.statusCode, response.request.uri.href );
					reject( new Error( 'Not a successful response from the backend.' ) );
				}
			}
		} );
	} );
}

function checkTime( start, end, name ){

	const time = ( end - start );

	if( time > config.backend.timeout ){

		reporter.message( 'info', `Long aggregate response time from backendService.${ name }`, { time, name } );
	}
}

function getAll( name, promises, dataFormatter ){

	const start = Date.now();

	return Promise.all( promises ).then( ( data ) => {

		checkTime( start, Date.now(), name );

		return dataFormatter( data );
	} );
}

function getSectorTeams( alice ){

	return get( alice, '/mi/sector_teams/' );
}

function getSectorTeam( alice, teamId ){

	return get( alice, `/mi/sector_teams/${ teamId }/` );
}

function getSectorTeamMonths( alice, teamId ){

	return get( alice, `/mi/sector_teams/${ teamId }/months/`, transformMonths );
}

function getSectorTeamCampaigns( alice, teamId ){

	return get( alice, `/mi/sector_teams/${ teamId }/campaigns/`, transformCampaigns );
}

function getSectorTeamTopNonHvc( alice, teamId ){

	return get( alice, `/mi/sector_teams/${ teamId }/top_non_hvcs/` );
}

function getSectorTeamsOverview( alice ){

	return get( alice, '/mi/sector_teams/overview/', transformSectorTeamsOverview );
}


function getOverseasRegions( alice ){

	return get( alice, '/mi/os_regions/' );
}

function getOverseasRegionGroups( alice ){

	return getOverseasRegions( alice ).then( transformOsRegions );
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

	return get( alice, `/mi/os_regions/${ regionId }/months/`, transformMonths );
}

function getOverseasRegionCampaigns( alice, regionId ){

	return get( alice, `/mi/os_regions/${ regionId }/campaigns/`, transformCampaigns );
}

function getOverseasRegionTopNonHvc( alice, regionId ){

	return get( alice, `/mi/os_regions/${ regionId }/top_non_hvcs/` );
}

function getOverseasRegionsOverview( alice ){

	return get( alice, '/mi/os_regions/overview/', transformOverseasRegionsOverview );
}


function getHvcGroups( alice ){

	return get( alice, '/mi/hvc_groups/' );
}

function getHvcGroup( alice, groupId ){

	return get( alice, `/mi/hvc_groups/${ groupId }/`, transformHvcGroup );
}

function getHvcGroupCampaigns( alice, groupId ){

	return get( alice, `/mi/hvc_groups/${ groupId }/campaigns/`, transformCampaigns );
}

function getHvcGroupMonths( alice, groupId ){

	return get( alice, `/mi/hvc_groups/${ groupId }/months/`, transformMonths );
}


const getWin = function(){ return require( '../../../data/mocks' ).win(); };

function getHvc( /* alice, hvcId */ ){

	//`/mi/hvc/${ hvcId }/`

	let data = require( '../../../data/mocks' ).hvc().then( function ( data ){

		data = Object.create( data );

		data.campaigns = transformCampaigns( data );

		return data;
	} );

	return data;
}

function getWinList( /* alice */ ){

	return require( '../../../data/mocks' ).winList().then( ( mockData ) => {

		let data = mockData.map( Object.create );

		data = require( '../transformers/win-list' )( data );

		return data;
	} );
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

		return getAll( 'getSectorTeamInfo', [

			getSectorTeam( alice, teamId ),
			getSectorTeamMonths( alice, teamId ),
			getSectorTeamTopNonHvc( alice, teamId ),
			getSectorTeamCampaigns( alice, teamId )

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

	getOverseasRegions,
	getOverseasRegionGroups,
	getOverseasRegion,
	getOverseasRegionMonths,
	getOverseasRegionTopNonHvc,
	getOverseasRegionCampaigns,
	getOverseasRegionName,

	getOverseasRegionInfo: function( alice, regionId ){

		return getAll( 'getOverseasRegionInfo', [

			getOverseasRegion( alice, regionId ),
			getOverseasRegionMonths( alice, regionId ),
			getOverseasRegionTopNonHvc( alice, regionId ),
			getOverseasRegionCampaigns( alice, regionId )

		], function( data ){

			return {
				wins: data[ 0 ],
				months: data[ 1 ],
				topNonHvc: data[ 2 ],
				campaigns: data[ 3 ]
			};
		} );
	},

	getSectorTeamsAndOverseasRegions: function( alice ){

		return getAll( 'getSectorTeamsAndOverseasRegions', [

			getSectorTeams( alice ),
			getOverseasRegionGroups( alice )

		], function( data ){

			return {
				sectorTeams: data[ 0 ],
				overseasRegionGroups: data[ 1 ]
			};
		} );
	},

	getOverseasRegionsOverview,

	getHvcGroups,
	getHvcGroup,
	getHvcGroupMonths,
	getHvcGroupCampaigns,

	getHvcGroupInfo: function( alice, parentId ){

		return getAll( 'getHvcGroupInfo', [

			getHvcGroup( alice, parentId ),
			getHvcGroupMonths( alice, parentId ),
			getHvcGroupCampaigns( alice, parentId )

		], function( data ){

			return {
				wins: data[ 0 ],
				months: data[ 1 ],
				campaigns: data[ 2 ]
			};
		} );
	},

	getHvc,
	getWin,
	getWinList
};
