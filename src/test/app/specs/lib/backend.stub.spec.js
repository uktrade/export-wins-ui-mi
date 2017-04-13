if( process.env.HAS_STUBS == 'true' ){

	console.log( 'Have stubs, running extra tests' );

} else {

	return;
}

const proxyquire = require( 'proxyquire' );
const backendStub = proxyquire( '../../../../app/lib/backend.stub', {
	'../config':  { backend: { stub: true, fake: false } }
} );

function getStub( path ){
	return require( '../../../../data/stubs/backend' + path );
}

const sectorsOverviewStub = getStub( '/sector_teams/overview' );
const sectorTeamsTopNonHvcStub = getStub( '/sector_teams/top_non_hvcs' );
const sectorTeamsCampaignsStub = getStub( '/sector_teams/campaigns' );
const sectorTeamMonthsStub = getStub( '/sector_teams/months' );
const sectorTeamStub = getStub( '/sector_teams/sector_team' );
const sectorTeamsStub = getStub( '/sector_teams/' );

const overseasRegionTopNonHvcStub = getStub( '/os_regions/top_non_hvcs' );
const overseasRegionCampaignsStub = getStub( '/os_regions/campaigns' );
const overseasRegionMonthsStub = getStub( '/os_regions/months' );
const overseasRegionStub = getStub( '/os_regions/region' );
const overseasRegionsStub = getStub( '/os_regions/' );
const overseasRegionsOverviewStub = getStub( '/os_regions/overview' );

const hvcGroupsStub = getStub( '/hvc_groups' );
const hvcGroupStub = getStub( '/hvc_groups/group' );
const hvcGroupCampaignsStub = getStub( '/hvc_groups/campaigns' );
const hvcGroupMonthsStub = getStub( '/hvc_groups/months' );


describe( 'Backend stub', function(){

	function checkStub( url, stub, done ){

		backendStub.get( 'fake-alice-str', url, ( err, response, data ) => {

			expect( err ).toBeNull();
			expect( response.statusCode ).toEqual( 200 );
			expect( response.isSuccess ).toEqual( true );
			expect( data ).toEqual( stub );
			done();
		} );
	}

	describe( 'Sectors', function(){

		describe( 'Getting the overview', function(){

			it( 'Should return the overview stub', function( done ){

				const url = '/mi/sector_teams/overview/?year=2016';

				checkStub( url, sectorsOverviewStub, done );
			} );
		} );

		describe( 'Getting the top non hvc regions and sectors', function(){

			it( 'Should return the top_non_hvc stub', function( done ){

				const url = '/mi/sector_teams/2/top_non_hvcs/?year=2016';

				checkStub( url, sectorTeamsTopNonHvcStub, done );
			} );
		} );

		describe( 'Getting campaigns', function(){

			it( 'Should return the campaigns stub', function( done ){

				const url = '/mi/sector_teams/1/campaigns/?year=2016';

				checkStub( url, sectorTeamsCampaignsStub, done );
			} );
		} );

		describe( 'Getting months', function(){

			it( 'Should return the months stub', function( done ){

				const url = '/mi/sector_teams/3/months/?year=2016';

				checkStub( url, sectorTeamMonthsStub, done );
			} );
		} );

		describe( 'Getting sector', function(){

			it( 'Should return the sector stub', function( done ){

				const url = '/mi/sector_teams/3/?year=2016';

				checkStub( url, sectorTeamStub, done );
			} );
		} );

		describe( 'Getting the sector list', function(){

			it( 'Should return the stub', function( done ){

				const url = '/mi/sector_teams/?year=2016';

				checkStub( url, sectorTeamsStub, done );
			} );
		} );
	} );


	describe( 'Overseas Regions', function(){

		describe( 'Getting the regions list', function(){

			it( 'Should return the list', function( done ){

				const url = '/mi/os_regions/?year=2016';

				checkStub( url, overseasRegionsStub, done );
			} );
		} );

		describe( 'Getting the top non hvc', function(){

			it( 'Should return the top_non_hvc stub', function( done ){

				const url = '/mi/os_regions/2/top_non_hvcs/?year=2016';

				checkStub( url, overseasRegionTopNonHvcStub, done );
			} );
		} );

		describe( 'Getting campaigns', function(){

			it( 'Should return the campaigns stub', function( done ){

				const url = '/mi/os_regions/3/campaigns/?year=2016';

				checkStub( url, overseasRegionCampaignsStub, done );
			} );
		} );

		describe( 'Getting months', function(){

			it( 'Should return the months stub', function( done ){

				const url = '/mi/os_regions/3/months/?year=2016';

				checkStub( url, overseasRegionMonthsStub, done );
			} );
		} );

		describe( 'Getting a region', function(){

			it( 'Should return the region stub', function( done ){

				const url = '/mi/os_regions/3/?year=2016';

				checkStub( url, overseasRegionStub, done );
			} );
		} );

		describe( 'Getting the overview', function(){

				it( 'Should return the overview', function( done ){

					const url = '/mi/os_regions/overview/?year=2016';

					checkStub( url, overseasRegionsOverviewStub, done );
				} );
			} );
	} );

	describe( 'HVC Groups', function(){

		describe( 'Getting the list of groups', function(){

			it( 'Should return the list', function( done ){

				const url = '/mi/hvc_groups/?year=2016';

				checkStub( url, hvcGroupsStub, done );
			} );
		} );

		describe( 'Getting a parent sector sector', function(){

			it( 'Should return the sector info', function( done ){

				const url = '/mi/hvc_groups/3/?year=2016';

				checkStub( url, hvcGroupStub, done );
			} );
		} );

		describe( 'Getting the campaigns', function(){

			it( 'Should return the campaigns', function( done ){

				const url = '/mi/hvc_groups/3/campaigns/?year=2016';

				checkStub( url, hvcGroupCampaignsStub, done );
			} );
		} );

		describe( 'Getting the months', function(){

			it( 'Should return the month info', function( done ){

				const url = '/mi/hvc_groups/3/months/?year=2016';

				checkStub( url, hvcGroupMonthsStub, done );
			} );
		} );
	} );
} );
