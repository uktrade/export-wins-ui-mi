const config = require( '../../config' );

const cookie = require( 'cookie' );

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


function convertDateRange( data ){

	if( data.date_range ){

		data.date_range.start = ( data.date_range.start * 1000 );
		data.date_range.end = ( data.date_range.end * 1000 );
	}
}

function get( path, alice, year, transform ){

	return new Promise( ( resolve, reject ) => {

		path = `${ path }?year=${ year }`;

		backend.sessionGet( alice, path, function( err, response, data ){

			if( err ){

				if( err.code === 'ECONNREFUSED' ){

					err = new Error( 'The backend is not available.' );
				}

				reject( err );

			} else {

				if( response.isSuccess ){

					convertDateRange( data );

					if( transform ){

						try {

							data.results = transform( data.results );
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

function getSectorTeams( alice, year ){

	return get( '/mi/sector_teams/', alice, year );
}

function getSectorTeam( alice, year, teamId ){

	return get( `/mi/sector_teams/${ teamId }/`, alice, year );
}

function getSectorTeamMonths( alice, year, teamId ){

	return get( `/mi/sector_teams/${ teamId }/months/`, alice, year, transformMonths );
}

function getSectorTeamCampaigns( alice, year, teamId ){

	return get( `/mi/sector_teams/${ teamId }/campaigns/`, alice, year, transformCampaigns );
}

function getSectorTeamTopNonHvc( alice, year, teamId ){

	return get( `/mi/sector_teams/${ teamId }/top_non_hvcs/`, alice, year );
}

function getSectorTeamsOverview( alice, year ){

	return get( '/mi/sector_teams/overview/', alice, year, transformSectorTeamsOverview );
}


function getOverseasRegions( alice, year ){

	return get( '/mi/os_regions/', alice, year );
}

function getOverseasRegionGroups( alice, year ){

	return getOverseasRegions( alice, year ).then( transformOsRegions );
}

function getOverseasRegion( alice, year, regionId ){

	return get( `/mi/os_regions/${ regionId }/`, alice, year );
}

function getOverseasRegionMonths( alice, year, regionId ){

	return get( `/mi/os_regions/${ regionId }/months/`, alice, year, transformMonths );
}

function getOverseasRegionCampaigns( alice, year, regionId ){

	return get( `/mi/os_regions/${ regionId }/campaigns/`, alice, year, transformCampaigns );
}

function getOverseasRegionTopNonHvc( alice, year, regionId ){

	return get( `/mi/os_regions/${ regionId }/top_non_hvcs/`, alice, year );
}

function getOverseasRegionsOverview( alice, year ){

	return get( '/mi/os_regions/overview/', alice, year, transformOverseasRegionsOverview );
}


function getHvcGroups( alice, year ){

	return get( '/mi/hvc_groups/', alice, year );
}

function getHvcGroup( alice, year, groupId ){

	return get( `/mi/hvc_groups/${ groupId }/`, alice, year, transformHvcGroup );
}

function getHvcGroupCampaigns( alice, year, groupId ){

	return get( `/mi/hvc_groups/${ groupId }/campaigns/`, alice, year, transformCampaigns );
}

function getHvcGroupMonths( alice, year, groupId ){

	return get( `/mi/hvc_groups/${ groupId }/months/`, alice, year, transformMonths );
}


function getWin(){

	return mocks.win();
}

function getHvc( /* alice, hvcId */ ){

	//`/mi/hvc/${ hvcId }/`

	return mocks.hvc().then( function ( data ){

		data = Object.create( data );

		data.campaigns = transformCampaigns( data );

		return data;
	} );
}

function getWinList( /* alice */ ){

	return mocks.winList().then( ( mockData ) => {

		let data = mockData.map( Object.create );

		data = require( '../transformers/win-list' )( data );

		return data;
	} );
}

function getSamlMetadata(){

	return new Promise( ( resolve, reject ) => {

		backend.get( '/saml2/metadata/', function( err, response, data ){

			if( err ){

				reject( err );

			} else {

				if( response.isSuccess ){

					resolve( data );

				} else {

					logger.error( 'Got a %s status code for url: %s', response.statusCode, response.request.uri.href );
					reject( new Error( 'Not a successful response from the backend' ) );
				}
			}
		} );
	} );
}

function sendSamlXml( xml ){

	return new Promise( ( resolve, reject ) => {

		backend.post( '/saml2/acs/', xml, function( err, response, data ){

			if( err ){

				reject( err );

			} else {

				if( response.isSuccess ){

					const setCookie = response.headers[ 'set-cookie' ] || '';
					const cookies = cookie.parse( setCookie );
					const sessionId = cookies.session_id;

					if( !sessionId ){

						reject( new Error( 'Unable to create session' ) );

					} else {

						resolve( { sessionId, data } );
					}

				} else {

					reject( new Error( 'Unable to login' ) );
				}
			}
		} );
	} );
}

function getSamlLogin(){

	return new Promise( ( resolve, reject ) => {

		backend.get( '/saml2/login/', function( err, response, data ){

			if( err ){

				reject( new Error( 'Unable to make request for login token' ) );

			} else {

				if( response.isSuccess ){

					resolve( data );

				} else {

					reject( new Error( 'Unable to get login token' ) );
				}
			}
		} );
	} );
}

module.exports = {

	getSectorTeams,
	getSectorTeam,
	getSectorTeamMonths,
	getSectorTeamCampaigns,
	getSectorTeamTopNonHvc,

	getSectorTeamInfo: function( alice, year, teamId ){

		return getAll( 'getSectorTeamInfo', [

			getSectorTeam( alice, year, teamId ),
			getSectorTeamMonths( alice, year, teamId ),
			getSectorTeamTopNonHvc( alice, year, teamId ),
			getSectorTeamCampaigns( alice, year, teamId )

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

	getOverseasRegionInfo: function( alice, year, regionId ){

		return getAll( 'getOverseasRegionInfo', [

			getOverseasRegion( alice, year, regionId ),
			getOverseasRegionMonths( alice, year, regionId ),
			getOverseasRegionTopNonHvc( alice, year, regionId ),
			getOverseasRegionCampaigns( alice, year, regionId )

		], function( data ){

			return {
				wins: data[ 0 ],
				months: data[ 1 ],
				topNonHvc: data[ 2 ],
				campaigns: data[ 3 ]
			};
		} );
	},

	getSectorTeamsAndOverseasRegions: function( alice, year ){

		return getAll( 'getSectorTeamsAndOverseasRegions', [

			getSectorTeams( alice, year ),
			getOverseasRegionGroups( alice, year )

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

	getHvcGroupInfo: function( alice, year, parentId ){

		return getAll( 'getHvcGroupInfo', [

			getHvcGroup( alice, year, parentId ),
			getHvcGroupMonths( alice, year, parentId ),
			getHvcGroupCampaigns( alice, year, parentId )

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
	getWinList,

	getSamlMetadata,
	sendSamlXml,
	getSamlLogin
};
