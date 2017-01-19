
function getStub( path ){

	return require( '../../stubs/backend/' + path );
}

const response = { statusCode: 200, isSuccess: true };

const stubs = [

	[ /^\/mi\/sector_teams\/overview\/$/, getStub( 'sector_teams/overview' ) ],
	[ /^\/mi\/sector_teams\/[0-9]+\/top_non_hvcs\/$/, getStub( 'sector_teams/top_non_hvcs' ) ],
	[ /^\/mi\/sector_teams\/[0-9]+\/campaigns\/$/, getStub( 'sector_teams/campaigns' ) ],
	[ /^\/mi\/sector_teams\/[0-9]+\/months\/$/, getStub( 'sector_teams/months_2016-12-12' ) ],
	[ /^\/mi\/sector_teams\/[0-9]+\/$/, getStub( 'sector_teams/sector_team_v2' ) ],
	[ /^\/mi\/sector_teams\/$/, getStub( 'sector_teams' ) ],

	[ /^\/mi\/os_regions\/[0-9]+\/top_non_hvcs\/$/, getStub( 'os_regions/top_non_hvcs' ) ],
	[ /^\/mi\/os_regions\/[0-9]+\/campaigns\/$/, getStub( 'os_regions/campaigns' ) ],
	[ /^\/mi\/os_regions\/[0-9]+\/months\/$/, getStub( 'os_regions/months' ) ],
	[ /^\/mi\/os_regions\/[0-9]+\/$/, getStub( 'os_regions/region' ) ],
	[ /^\/mi\/os_regions\/$/, getStub( 'os_regions' ) ],
	[ /^\/mi\/os_regions\/overview\/$/, getStub( 'os_regions/overview' ) ],

	[ /^\/mi\/parent_sectors\/$/, getStub( 'parent_sectors' ) ],
	[ /^\/mi\/parent_sectors\/[0-9]+\/$/, getStub( 'parent_sector' ) ],
	[ /^\/mi\/parent_sectors\/[0-9]+\/campaigns\/$/, getStub( 'parent_sector_campaigns' ) ],
	[ /^\/mi\/parent_sectors\/[0-9]+\/months\/$/, getStub( 'parent_sector_months' ) ],
	[ /^\/mi\/parent_sectors\/[0-9]+\/top_non_hvcs\/$/, getStub( 'parent_sector_top_non_hvcs' ) ]
];

module.exports = {

	get: function( alice, url, cb ){

		let data;
		let path;
		let stub;

		for( [ path, stub ] of stubs ){

			if( path.test( url ) ){

				data = stub;
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
