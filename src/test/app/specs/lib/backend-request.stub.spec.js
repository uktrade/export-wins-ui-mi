if( process.env.HAS_STUBS == 'true' ){

	console.log( 'Have stubs, running extra tests' );

} else {

	return;
}

const proxyquire = require( 'proxyquire' );
const backendStub = proxyquire( '../../../../app/lib/backend-request.stub', {
	'../config':  { backend: { stub: true, fake: false } }
} );

const years = [ 2016, 2017 ];

function getStub( path ){
	return require( '../../../../data/stubs/backend' + path );
}

describe( 'Backend stub', function(){

	function checkStub( urlPath, stubPath, done ){

		backendStub.get( urlPath, ( err, response, data ) => {

			expect( err ).toBeNull();
			expect( response.statusCode ).toEqual( 200 );
			expect( response.isSuccess ).toEqual( true );
			expect( data ).toEqual( getStub( stubPath ) );
			done();
		} );
	}

	function checkMultipleYears( urlPath, stubPath, done ){

		for( let year of years ){

			// console.log( `${ urlPath }?year=${ year }`, `${ stubPath }.${ year }` );

			checkStub( `${ urlPath }?year=${ year }`, `${ stubPath }.${ year }`, done );
		}
	}

	describe( 'User', function(){

		describe( 'Getting the info', function(){

			it( 'Should return the info for the user', function( done ){

				checkStub( '/user/me/', '/user/me', done );
			} );
		} );
	} );

	describe( 'HVC', function(){

		describe( 'Getting the info', function(){

			it( 'Should return the info for the hvc', function( done ){

				checkMultipleYears( '/mi/hvc/1/', '/hvc/hvc', done );
			} );
		} );

		describe( 'Getting the top wins', function(){

			it( 'Should return the top wins', function( done ){

				checkMultipleYears( '/mi/hvc/1/top_wins/', '/hvc/top_wins', done );
			} );
		} );

		describe( 'Getting the win table', function(){

			it( 'Should return the win table', function( done ){

				checkMultipleYears( '/mi/hvc/1/win_table/', '/hvc/win_table', done );
			} );
		} );
	} );

	describe( 'Global HVCs', function(){

		describe( 'Getting the hvcs', function(){

			it( 'Should return the list of HVCs', function( done ){

				checkMultipleYears( '/mi/global_hvcs/', '/global_hvcs/index', done );
			} );
		} );
	} );

	describe( 'Global wins', function(){

		describe( 'Getting the wins', function(){

			it( 'Should return the list of wins', function( done ){

				checkMultipleYears( '/mi/global_wins/', '/global_wins/index', done );
			} );
		} );
	} );

	describe( 'Sectors', function(){

		describe( 'Getting the overview', function(){

			it( 'Should return the overview stub', function( done ){

				checkMultipleYears( '/mi/sector_teams/overview/', '/sector_teams/overview', done );
			} );
		} );

		describe( 'Getting the top non hvc regions and sectors', function(){

			it( 'Should return the top_non_hvc stub', function( done ){

				checkMultipleYears( '/mi/sector_teams/2/top_non_hvcs/', '/sector_teams/top_non_hvcs', done );
			} );
		} );

		describe( 'Getting campaigns', function(){

			it( 'Should return the campaigns stub', function( done ){

				checkMultipleYears( '/mi/sector_teams/1/campaigns/', '/sector_teams/campaigns', done );
			} );
		} );

		describe( 'Getting months', function(){

			it( 'Should return the months stub', function( done ){

				checkMultipleYears( '/mi/sector_teams/3/months/', '/sector_teams/months', done );
			} );
		} );

		describe( 'Getting sector', function(){

			it( 'Should return the sector stub', function( done ){

				checkMultipleYears( '/mi/sector_teams/3/', '/sector_teams/sector_team', done );
			} );
		} );

		describe( 'Getting sector win table', function(){

			it( 'Should return the sector win table stub', function( done ){

				checkMultipleYears( '/mi/sector_teams/3/win_table/', '/sector_teams/win_table', done );
			} );
		} );

		describe( 'Getting the sector list', function(){

			it( 'Should return the stub', function( done ){

				checkMultipleYears( '/mi/sector_teams/', '/sector_teams/index', done );
			} );
		} );
	} );


	describe( 'Overseas Regions', function(){

		describe( 'Getting the regions list', function(){

			it( 'Should return the list', function( done ){

				checkMultipleYears( '/mi/os_regions/', '/os_regions/index', done );
			} );
		} );

		describe( 'Getting the top non hvc', function(){

			it( 'Should return the top_non_hvc stub', function( done ){

				checkMultipleYears( '/mi/os_regions/2/top_non_hvcs/', '/os_regions/top_non_hvcs', done );
			} );
		} );

		describe( 'Getting campaigns', function(){

			it( 'Should return the campaigns stub', function( done ){

				checkMultipleYears( '/mi/os_regions/3/campaigns/', '/os_regions/campaigns', done );
			} );
		} );

		describe( 'Getting months', function(){

			it( 'Should return the months stub', function( done ){

				checkMultipleYears( '/mi/os_regions/3/months/', '/os_regions/months', done );
			} );
		} );

		describe( 'Getting a region', function(){

			it( 'Should return the region stub', function( done ){

				checkMultipleYears( '/mi/os_regions/3/', '/os_regions/region', done );
			} );
		} );

		describe( 'Getting a region win table', function(){

			it( 'Should return the region win table stub', function( done ){

				checkMultipleYears( '/mi/os_regions/3/win_table/', '/os_regions/win_table', done );
			} );
		} );

		describe( 'Getting the overview', function(){

			it( 'Should return the overview', function( done ){

					checkMultipleYears( '/mi/os_regions/overview/', '/os_regions/overview', done );
			} );
		} );
	} );

	describe( 'Overseas Regions Groups', function(){

		describe( 'Getting the groups', function(){

			it( 'Should return the groups', function( done ){

					checkMultipleYears( '/mi/os_region_groups/', '/os_region_groups/index', done );
			} );
		} );
	} );

	describe( 'HVC Groups', function(){

		describe( 'Getting the list of groups', function(){

			it( 'Should return the list', function( done ){

				checkMultipleYears( '/mi/hvc_groups/', '/hvc_groups/index', done );
			} );
		} );

		describe( 'Getting a parent sector sector', function(){

			it( 'Should return the sector info', function( done ){

				checkMultipleYears( '/mi/hvc_groups/3/', '/hvc_groups/group', done );
			} );
		} );

		describe( 'Getting the campaigns', function(){

			it( 'Should return the campaigns', function( done ){

				checkMultipleYears( '/mi/hvc_groups/3/campaigns/', '/hvc_groups/campaigns', done );
			} );
		} );

		describe( 'Getting the months', function(){

			it( 'Should return the month info', function( done ){

				checkMultipleYears( '/mi/hvc_groups/3/months/', '/hvc_groups/months', done );
			} );
		} );

		describe( 'Getting the win table', function(){

			it( 'Should return the win table stub', function( done ){

				checkMultipleYears( '/mi/hvc_groups/3/win_table/', '/hvc_groups/win_table', done );
			} );
		} );
	} );
} );
