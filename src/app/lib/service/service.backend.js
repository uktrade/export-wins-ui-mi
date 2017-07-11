const config = require( '../../config' );

const USE_MOCKS = config.backend.mock;
const USE_STUBS = config.backend.stub;

const internalUsers = config.internalUsers.split( ',' );

const logger = require( '../logger' );
const reporter = require( '../reporter' );
const backend = ( USE_STUBS ? require( '../backend-request.stub' ) : require( '../backend-request' ) );
const mocks = ( USE_MOCKS ? require( '../../../data/mocks' ) : null );

const transformMonths = require( '../transformers/months' );
const transformCampaigns = require( '../transformers/campaigns' );
const transformSectorTeamsOverview = require( '../transformers/sector-teams-overview' );
const transformOverseasRegionsOverview = require( '../transformers/os-regions-overview' );
const transformOverseasRegionsOverviewGroups = require( '../transformers/os-regions-overview-groups' );
const transformHvcGroup = require( '../transformers/hvc-group' );


function convertDateRange( data ){

	if( data.date_range ){

		data.date_range.start = ( data.date_range.start * 1000 );
		data.date_range.end = ( data.date_range.end * 1000 );
	}
}

function getJson( path, req, transform ){

	path = `${ path }?year=${ req.year }`;

	return sessionGet( path, req ).then( ( info ) => {

		const response = info.response;
		const data = info.data;

		convertDateRange( data );

		if( transform ){

			try {

				data.results = transform( data.results );

			} catch ( e ){

				logger.error( 'Unable to transform API response for url: %s', response.request.uri.href );
				logger.error( e );
				throw( new Error( 'Unable to transform API response' ) );
			}
		}

		return data;
	} );
}

function createResponseHandler( resolve, reject ){

	return function( err, response, data ){

		if( err ){

			if( err.code === 'ECONNREFUSED' ){

				err = new Error( 'The backend is not available.' );
			}

			reject( err );

		} else {

			if( response.isSuccess ){

				resolve( { response, data } );

			} else {

				let message = 'Not a successful response from the backend.';
				let logType = 'error';

				if( response.statusCode === 403 ){

					message = 'Not logged in';
					logType = 'debug';
				}

				const e = new Error( message );

				e.code = response.statusCode;
				e.response = response;
				e.data = data;

				logger[ logType ]( 'Got a %s status code for url: %s', response.statusCode, response.request.uri.href );
				reject( e );
			}
		}
	};
}

function sessionGet( path, req ){

	return new Promise( ( resolve, reject ) => {

		backend.sessionGet( req.cookies.sessionid, path, createResponseHandler( resolve, reject ) );
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

function getSectorTeamsOverview( req ){

	return getJson( '/mi/sector_teams/overview/', req, transformSectorTeamsOverview );
}


function getOverseasRegions( req ){

	return getJson( '/mi/os_regions/', req );
}

function getOverseasRegionGroups( req ){

	//return getOverseasRegions( req ).then( transformOsRegions );
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

function getOverseasRegionsOverview( req ){

	return getJson( '/mi/os_regions/overview/', req, transformOverseasRegionsOverview );
}


function getHvc( req, hvcId ){

	return getJson( `/mi/hvc/${ hvcId }/`, req );
}

function getHvcMarkets( req, hvcId ){

	return getJson( `/mi/hvc/${ hvcId }/top_wins/`, req );
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


function getWin(){

	return mocks.win();
}

function getWinList( /* req */ ){

	return mocks.winList().then( ( mockData ) => {

		let data = mockData.map( Object.create );

		data = require( '../transformers/win-list' )( data );

		return data;
	} );
}

function getSamlMetadata( req ){

	return new Promise( ( resolve, reject ) => {

		//TODO: This probably doesn't need the session here
		backend.sessionGet( req.cookies.sessionid, '/saml2/metadata/', createResponseHandler( resolve, reject ) );

	} ).then( ( info ) => info.data );
}

function sendSamlXml( req ){

	return new Promise( ( resolve, reject ) => {

		backend.sessionPost( req.cookies.sessionid, '/saml2/acs/', req.data, createResponseHandler( resolve, reject ) );
	} );
}

function getSamlLogin( req ){

	return new Promise( ( resolve, reject ) => {

		backend.sessionGet( req.cookies.sessionid, '/saml2/login/', createResponseHandler( resolve, reject ) );
	} );
}


module.exports = {

	getSectorTeams,
	getSectorTeam,
	getSectorTeamMonths,
	getSectorTeamCampaigns,
	getSectorTeamTopNonHvc,

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

	getOverseasRegions,
	getOverseasRegionGroups,
	getOverseasRegion,
	getOverseasRegionMonths,
	getOverseasRegionTopNonHvc,
	getOverseasRegionCampaigns,

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

	getSectorTeamsAndOverseasRegions: function( req ){

		return getAll( 'getSectorTeamsAndOverseasRegions', [

			getSectorTeams( req ),
			getOverseasRegionGroups( req )

		], function( data ){

			return {
				sectorTeams: data[ 0 ],
				overseasRegionGroups: data[ 1 ]
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

	getWin,
	getWinList,

	getSamlMetadata,
	sendSamlXml,
	getSamlLogin,

	getUserInfo: function( req ){

		return sessionGet( '/user/me/', req ).then( ( info ) => {

			const user = info.data;

			user.internal = !!~internalUsers.indexOf( user.email );

			return user;
		} );
	}
};
