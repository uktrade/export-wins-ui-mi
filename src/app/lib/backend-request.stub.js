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
	[ /^\/user\/me\/$/, 'user/me' ]
];

const filteredStubs = [

	[ '/mi/sector_teams/overview/', 'sector_teams/overview'  ],
	[ '/mi/sector_teams/', 'sector_teams/index'  ],
	[ '/mi/sector_teams/[0-9]+/', 'sector_teams/sector_team'  ],
	[ '/mi/sector_teams/[0-9]+/campaigns/', 'sector_teams/campaigns'  ],
	[ '/mi/sector_teams/[0-9]+/months/', 'sector_teams/months'  ],
	[ '/mi/sector_teams/[0-9]+/top_non_hvcs/', 'sector_teams/top_non_hvcs'  ],
	[ '/mi/sector_teams/[0-9]+/win_table/', 'sector_teams/win_table'  ],

	[ '/mi/os_regions/overview/', 'os_regions/overview'  ],
	[ '/mi/os_regions/', 'os_regions/index'  ],
	[ '/mi/os_regions/[0-9]+/', 'os_regions/region'  ],
	[ '/mi/os_regions/[0-9]+/campaigns/', 'os_regions/campaigns'  ],
	[ '/mi/os_regions/[0-9]+/months/', 'os_regions/months'  ],
	[ '/mi/os_regions/[0-9]+/top_non_hvcs/', 'os_regions/top_non_hvcs'  ],
	[ '/mi/os_regions/[0-9]+/win_table/', 'os_regions/win_table'  ],

	[ '/mi/os_region_groups/', 'os_region_groups/index'  ],

	[ '/mi/hvc_groups/', 'hvc_groups/index'  ],
	[ '/mi/hvc_groups/[0-9]+/', 'hvc_groups/group'  ],
	[ '/mi/hvc_groups/[0-9]+/campaigns/', 'hvc_groups/campaigns'  ],
	[ '/mi/hvc_groups/[0-9]+/months/', 'hvc_groups/months' ],
	[ '/mi/hvc_groups/[0-9]+/win_table/', 'hvc_groups/win_table' ],

	[ '/mi/hvc/[^/]+?/', 'hvc/hvc' ],
	[ '/mi/hvc/[^/]+?/top_wins/', 'hvc/top_wins' ],
	[ '/mi/hvc/[^/]+?/win_table/', 'hvc/win_table' ],

	[ '/mi/global_hvcs/', 'global_hvcs/index' ],
	[ '/mi/global_wins/', 'global_wins/index' ],

	[ '/mi/countries/', 'countries/index'  ],
	[ '/mi/countries/[A-Z]{2}/', 'countries/country'  ],
	[ '/mi/countries/[A-Z]{2}/campaigns/', 'countries/campaigns'  ],
	[ '/mi/countries/[A-Z]{2}/months/', 'countries/months'  ],
	[ '/mi/countries/[A-Z]{2}/top_non_hvcs/', 'countries/top_non_hvcs'  ],
	[ '/mi/countries/[A-Z]{2}/win_table/', 'countries/win_table'  ],

	[ '/mi/posts/', 'posts/index'  ],
	[ '/mi/posts/[A-Za-z-]+/', 'posts/post'  ],
	[ '/mi/posts/[A-Za-z-]+/campaigns/', 'posts/campaigns'  ],
	[ '/mi/posts/[A-Za-z-]+/months/', 'posts/months'  ],
	[ '/mi/posts/[A-Za-z-]+/top_non_hvcs/', 'posts/top_non_hvcs'  ],
	[ '/mi/posts/[A-Za-z-]+/win_table/', 'posts/win_table'  ],

	[ '/mi/uk_regions/', 'uk_regions/index'  ],
	[ '/mi/uk_regions/overview/', 'uk_regions/overview'  ],
	[ '/mi/uk_regions/[A-Za-z-]+/', 'uk_regions/region'  ],
	[ '/mi/uk_regions/[A-Za-z-]+/months/', 'uk_regions/months'  ],
	[ '/mi/uk_regions/[A-Za-z-]+/top_non_hvcs/', 'uk_regions/top_non_hvcs'  ],
	[ '/mi/uk_regions/[A-Za-z-]+/win_table/', 'uk_regions/win_table'  ],

	[ '/mi/investment/sector_teams/', 'investment/sector_teams/index'  ],
	[ '/mi/investment/os_regions/', 'investment/os_regions/index'  ],
	[ '/mi/fdi/overview/', 'investment/fdi/overview'  ],
	[ '/mi/fdi/overview/yoy/', 'investment/fdi/overview_yoy'  ]
];

for( let [ path, stubFile ] of filteredStubs ){

	stubs.push( [ new RegExp( '^' + path + '(\\?year=[0-9]+(&date_(start|end)=.+)?)?$' ), stubFile ] );
}

const urlYear = /\?year=([0-9]+)/;

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
	let pathMatched;

	response.request = {
		uri: {
			href: url,
			path: url
		}
	};

	for( [ path, stub ] of stubs ){

		pathMatched = path.test( url );

		if( pathMatched ){

			year = getYear( url );

			if( year ){

				stub += ( '.' + year );
			}

			data = getStub( stubPath + stub  );

			break;
		}
	}

	if( data ){

		logger.debug( 'Stub response for: %s, with stub: %s', url, stub );
		cb( null, response, data );

	} else {

		cb( new Error( `Path not matched for ${ url }` ) );
	}
}

module.exports = {

	get,
	sessionGet: function( sessionId, path, cb ){

		get( path, cb );
	}
};
