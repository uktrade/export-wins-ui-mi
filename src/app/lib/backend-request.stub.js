const config = require( '../config' );
const logger = require( './logger' );

let stubPath = '../../data/stubs/backend/';

logger.warn( 'Using stubs for backend' );

if( config.backend.fake ){

	logger.warn( 'Using fake stubs for backend' );

	stubPath = '../../data/fake-stubs/backend/';
}

const response = { statusCode: 200, isSuccess: true, elapsedTime: 0 };

const stubs = [

	[ /^\/mi\/sector_teams\/overview\/(\?year=[0-9]+)?$/, 'sector_teams/overview'  ],
	[ /^\/mi\/sector_teams\/[0-9]+\/top_non_hvcs\/(\?year=[0-9]+)?$/, 'sector_teams/top_non_hvcs'  ],
	[ /^\/mi\/sector_teams\/[0-9]+\/campaigns\/(\?year=[0-9]+)?$/, 'sector_teams/campaigns'  ],
	[ /^\/mi\/sector_teams\/[0-9]+\/months\/(\?year=[0-9]+)?$/, 'sector_teams/months'  ],
	[ /^\/mi\/sector_teams\/[0-9]+\/(\?year=[0-9]+)?$/, 'sector_teams/sector_team'  ],
	[ /^\/mi\/sector_teams\/(\?year=[0-9]+)?$/, 'sector_teams/index'  ],

	[ /^\/mi\/os_regions\/[0-9]+\/top_non_hvcs\/(\?year=[0-9]+)?$/, 'os_regions/top_non_hvcs'  ],
	[ /^\/mi\/os_regions\/[0-9]+\/campaigns\/(\?year=[0-9]+)?$/, 'os_regions/campaigns'  ],
	[ /^\/mi\/os_regions\/[0-9]+\/months\/(\?year=[0-9]+)?$/, 'os_regions/months'  ],
	[ /^\/mi\/os_regions\/[0-9]+\/(\?year=[0-9]+)?$/, 'os_regions/region'  ],
	[ /^\/mi\/os_regions\/(\?year=[0-9]+)?$/, 'os_regions/index'  ],
	[ /^\/mi\/os_regions\/overview\/(\?year=[0-9]+)$/, 'os_regions/overview'  ],

	[ /^\/mi\/os_region_groups\/(\?year=[0-9]+)$/, 'os_region_groups/index'  ],

	[ /^\/mi\/hvc_groups\/(\?year=[0-9]+)?$/, 'hvc_groups/index'  ],
	[ /^\/mi\/hvc_groups\/[0-9]+\/(\?year=[0-9]+)?$/, 'hvc_groups/group'  ],
	[ /^\/mi\/hvc_groups\/[0-9]+\/campaigns\/(\?year=[0-9]+)?$/, 'hvc_groups/campaigns'  ],
	[ /^\/mi\/hvc_groups\/[0-9]+\/months\/(\?year=[0-9]+)?$/, 'hvc_groups/months' ],

	[ /^\/user\/me\/$/, 'user/me' ]
];

const urlYear = /\?year=([0-9]+)$/;

//ensure that we don't return a modified response
function getStub( path ){

	const json = JSON.stringify( require( path ) );

	return JSON.parse( json );
}

function getYear( url ){

	const yearMatches = urlYear.exec( url );

	if( yearMatches && yearMatches.length > 1 ){

		return yearMatches[ 1 ];
	}
}

function get( url, cb ){

	let data;
	let path;
	let stub;
	let year;

	response.request = {
		uri: {
			href: url,
			path: url
		}
	};

	for( [ path, stub ] of stubs ){

		if( path.test( url ) ){

			year = getYear( url );

			if( year ){

				stub += ( '.' + year );
			}

			data = getStub( stubPath + stub  );
			break;
		}
	}

	logger.debug( 'Stub response for: %s, with stub: %s', url, stub );

	if( data ){

		cb( null, response, data );

	} else {

		cb( new Error( 'Stub not matched' ) );
	}
}

module.exports = {

	get,
	sessionGet: function( sessionId, path, cb ){

		get( path, cb );
	}
};