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

	[ /^\/mi\/sector_teams\/overview\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'sector_teams/overview'  ],
	[ /^\/mi\/sector_teams\/[0-9]+\/top_non_hvcs\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'sector_teams/top_non_hvcs'  ],
	[ /^\/mi\/sector_teams\/[0-9]+\/campaigns\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'sector_teams/campaigns'  ],
	[ /^\/mi\/sector_teams\/[0-9]+\/months\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'sector_teams/months'  ],
	[ /^\/mi\/sector_teams\/[0-9]+\/win_table\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'sector_teams/win_table'  ],
	[ /^\/mi\/sector_teams\/[0-9]+\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'sector_teams/sector_team'  ],
	[ /^\/mi\/sector_teams\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'sector_teams/index'  ],

	[ /^\/mi\/os_regions\/[0-9]+\/top_non_hvcs\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'os_regions/top_non_hvcs'  ],
	[ /^\/mi\/os_regions\/[0-9]+\/campaigns\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'os_regions/campaigns'  ],
	[ /^\/mi\/os_regions\/[0-9]+\/months\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'os_regions/months'  ],
	[ /^\/mi\/os_regions\/[0-9]+\/win_table\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'os_regions/win_table'  ],
	[ /^\/mi\/os_regions\/[0-9]+\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'os_regions/region'  ],
	[ /^\/mi\/os_regions\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'os_regions/index'  ],
	[ /^\/mi\/os_regions\/overview\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'os_regions/overview'  ],

	[ /^\/mi\/os_region_groups\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'os_region_groups/index'  ],

	[ /^\/mi\/hvc_groups\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'hvc_groups/index'  ],
	[ /^\/mi\/hvc_groups\/[0-9]+\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'hvc_groups/group'  ],
	[ /^\/mi\/hvc_groups\/[0-9]+\/campaigns\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'hvc_groups/campaigns'  ],
	[ /^\/mi\/hvc_groups\/[0-9]+\/months\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'hvc_groups/months' ],
	[ /^\/mi\/hvc_groups\/[0-9]+\/win_table\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'hvc_groups/win_table' ],

	[ /^\/mi\/hvc\/[^/]+?\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'hvc/hvc' ],
	[ /^\/mi\/hvc\/[^/]+?\/top_wins\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'hvc/top_wins' ],
	[ /^\/mi\/hvc\/[^/]+?\/win_table\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'hvc/win_table' ],

	[ /^\/mi\/global_hvcs\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'global_hvcs/index' ],
	[ /^\/mi\/global_wins\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'global_wins/index' ],

	[ /^\/mi\/countries\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'countries/index'  ],
	[ /^\/mi\/countries\/[A-Z]{2}\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'countries/country'  ],
	[ /^\/mi\/countries\/[A-Z]{2}\/campaigns\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'countries/campaigns'  ],
	[ /^\/mi\/countries\/[A-Z]{2}\/months\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'countries/months'  ],
	[ /^\/mi\/countries\/[A-Z]{2}\/top_non_hvcs\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'countries/top_non_hvcs'  ],
	[ /^\/mi\/countries\/[A-Z]{2}\/win_table\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'countries/win_table'  ],

	[ /^\/mi\/posts\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'posts/index'  ],
	[ /^\/mi\/posts\/[A-Za-z-]+\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'posts/country'  ],
	[ /^\/mi\/posts\/[A-Za-z-]+\/campaigns\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'posts/campaigns'  ],
	[ /^\/mi\/posts\/[A-Za-z-]+\/months\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'posts/months'  ],
	[ /^\/mi\/posts\/[A-Za-z-]+\/top_non_hvcs\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'posts/top_non_hvcs'  ],
	[ /^\/mi\/posts\/[A-Za-z-]+\/win_table\/(\?year=[0-9]+(&date_(start|end)=.+)?)?$/, 'posts/win_table'  ],

	[ /^\/user\/me\/$/, 'user/me' ]
];

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

		if( pathMatched ){

			cb( new Error( `Stub not matched for ${ url }` ) );

		} else {

			cb( new Error( `Path not matched for ${ url }` ) );
		}

	}
}

module.exports = {

	get,
	sessionGet: function( sessionId, path, cb ){

		get( path, cb );
	}
};
