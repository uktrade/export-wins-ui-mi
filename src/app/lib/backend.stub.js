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

	[ /^\/mi\/sector_teams\/overview\/$/, 'sector_teams/overview'  ],
	[ /^\/mi\/sector_teams\/[0-9]+\/top_non_hvcs\/$/, 'sector_teams/top_non_hvcs'  ],
	[ /^\/mi\/sector_teams\/[0-9]+\/campaigns\/$/, 'sector_teams/campaigns'  ],
	[ /^\/mi\/sector_teams\/[0-9]+\/months\/$/, 'sector_teams/months'  ],
	[ /^\/mi\/sector_teams\/[0-9]+\/$/, 'sector_teams/sector_team'  ],
	[ /^\/mi\/sector_teams\/$/, 'sector_teams'  ],

	[ /^\/mi\/os_regions\/[0-9]+\/top_non_hvcs\/$/, 'os_regions/top_non_hvcs'  ],
	[ /^\/mi\/os_regions\/[0-9]+\/campaigns\/$/, 'os_regions/campaigns'  ],
	[ /^\/mi\/os_regions\/[0-9]+\/months\/$/, 'os_regions/months'  ],
	[ /^\/mi\/os_regions\/[0-9]+\/$/, 'os_regions/region'  ],
	[ /^\/mi\/os_regions\/$/, 'os_regions'  ],
	[ /^\/mi\/os_regions\/overview\/$/, 'os_regions/overview'  ],

	[ /^\/mi\/hvc_groups\/$/, 'hvc_groups'  ],
	[ /^\/mi\/hvc_groups\/[0-9]+\/$/, 'hvc_groups/group'  ],
	[ /^\/mi\/hvc_groups\/[0-9]+\/campaigns\/$/, 'hvc_groups/campaigns'  ],
	[ /^\/mi\/hvc_groups\/[0-9]+\/months\/$/, 'hvc_groups/months' ]
];

module.exports = {

	get: function( alice, url, cb ){

		let data;
		let path;
		let stub;

		response.request = {
			uri: {
				path: url
			}
		};

		for( [ path, stub ] of stubs ){

			if( path.test( url ) ){

				data = require( stubPath + stub );
				break;
			}
		}

		if( data ){

			cb( null, response, data );

		} else {

			cb( new Error( 'Stub not matched' ) );
		}
	}
};
