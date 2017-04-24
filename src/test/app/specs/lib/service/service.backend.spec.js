const proxyquire = require( 'proxyquire' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );
const interceptBackend = require( '../../../helpers/intercept-backend' );

const configStub = { backend: { stub: false, fake: false, mock: false } };

let alice = 'test';
let year = '2017';
let stubs;
let backendService;
let monthsSpy;
let campaignsSpy;
let sectorTeamsOverviewSpy;
let osRegionsOverviewSpy;
let hvcGroupSpy;
let osRegionsSpy;
let backend;


function returnStub( file ){

	spyOn( backend, 'get' ).and.callFake( function( path, alice, year, cb ){

		cb( null, { isSuccess: true, elapsedTime: 0 }, getBackendStub( file ) );
	} );
}

describe( 'Backend service', function(){

	let oldTimeout;

	beforeEach( function(){

		oldTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
	} );

	afterEach( function(){

		jasmine.DEFAULT_TIMEOUT_INTERVAL = oldTimeout;
	} );

	describe( 'Single methods', function(){

		beforeEach( function(){

			monthsSpy = jasmine.createSpy( 'months' );
			campaignsSpy = jasmine.createSpy( 'campaigns' );
			sectorTeamsOverviewSpy = jasmine.createSpy( 'sector-teams-overview' );
			osRegionsOverviewSpy = jasmine.createSpy( 'os-regions-overview' );
			hvcGroupSpy = jasmine.createSpy( 'hvc-group' );
			osRegionsSpy = jasmine.createSpy( 'os-regions' );
			backend = {
				get: function(){}
			};

			stubs = {
				'../../config': configStub,
				'../logger': require( '../../../helpers/mock-logger' ),
				'../transformers/months': monthsSpy,
				'../transformers/campaigns': campaignsSpy,
				'../transformers/sector-teams-overview': sectorTeamsOverviewSpy,
				'../transformers/os-regions-overview': osRegionsOverviewSpy,
				'../transformers/hvc-group': hvcGroupSpy,
				'../transformers/os-regions': osRegionsSpy,
				'../backend': backend
			};

			backendService = proxyquire( '../../../../../app/lib/service/service.backend', stubs );
		} );

		describe( 'The date_range', function(){

			describe( 'An enpoint that has a date_range', function(){

				it( 'Should convert it from seconds to milliseconds', function( done ){

					const teamId = '3';

					returnStub( '/sector_teams/' );

					backendService.getSectorTeam( alice, year, teamId ).then( ( data ) => {

						expect( data.date_range ).toBeDefined();
						expect( data.date_range.start ).toEqual( 1459468800 * 1000 );
						expect( data.date_range.end ).toEqual( 1483228800 * 1000 );

						done();

					} ).catch( done );
				} );
			} );

			describe( 'An enpoint the does not have a date_range', function(){

				it( 'Should do nothing', function( done ){

					returnStub( '/os_regions/' );

					backendService.getOverseasRegions( alice, year ).then( ( data ) => {

						expect( data.date_range ).not.toBeDefined();
						done();

					} ).catch( done );

					done();
				} );
			} );

		} );

		describe( 'Getting the sector team', function(){

			it( 'Should use the sector transformer', function( done ){

				const teamId = '3';

				returnStub( '/sector_teams/' );

				backendService.getSectorTeam( alice, year, teamId ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( `/mi/sector_teams/${ teamId }/?year=${ year }` );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting the sector team months', function(){

			it( 'Should use the months transformer', function( done ){

				const teamId = '4';

				returnStub( '/sector_teams/months' );

				backendService.getSectorTeamMonths( alice, year, teamId ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( `/mi/sector_teams/${ teamId }/months/?year=${ year }` );

					expect( monthsSpy ).toHaveBeenCalled();
					expect( monthsSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting the sector team campaigns', function(){

			it( 'Should use the campaigns transformer', function( done ){

				const teamId = '5';

				returnStub( '/sector_teams/campaigns' );

				backendService.getSectorTeamCampaigns( alice, year, teamId ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( `/mi/sector_teams/${ teamId }/campaigns/?year=${ year }` );

					expect( campaignsSpy ).toHaveBeenCalled();
					expect( campaignsSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting the sector team top non HVCs', function(){

			it( 'Should use the call the correct endpoint', function( done ){

				const teamId = '5';

				returnStub( '/sector_teams/top_non_hvcs' );

				backendService.getSectorTeamTopNonHvc( alice, year, teamId ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( `/mi/sector_teams/${ teamId }/top_non_hvcs/?year=${ year }` );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting the sector team overview', function(){

			it( 'Should use the sector teams overview transformer', function( done ){

				returnStub( '/sector_teams/overview' );

				backendService.getSectorTeamsOverview( alice, year ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( '/mi/sector_teams/overview/?year=${ year }' );

					expect( sectorTeamsOverviewSpy ).toHaveBeenCalled();
					expect( sectorTeamsOverviewSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting the overseas regions list', function(){

			it( 'Should use the os-regions transformer', function( done ){

				returnStub( '/os_regions/' );

				backendService.getOverseasRegions( alice, year ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( '/mi/os_regions/?year=${ year }' );

					expect( osRegionsSpy ).not.toHaveBeenCalled();
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting the Grouped overseas regions list', function(){

			it( 'Should use the os-regions transformer', function( done ){

				returnStub( '/os_regions/' );

				backendService.getOverseasRegionGroups( alice, year ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( '/mi/os_regions/?year=${ year }' );

					expect( osRegionsSpy ).toHaveBeenCalled();
					expect( osRegionsSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting the overseas region', function(){

			it( 'Should use the sector transformer', function( done ){

				const regionId = '1';

				returnStub( '/os_regions/region' );

				backendService.getOverseasRegion( alice, year, regionId ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( `/mi/os_regions/${ regionId }/?year=${ year }` );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting the overseas regions months', function(){

			it( 'Should use the months transformer', function( done ){

				const regionId = '2';

				returnStub( '/os_regions/months' );

				backendService.getOverseasRegionMonths( alice, year, regionId ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( `/mi/os_regions/${ regionId }/months/?year=${ year }` );

					expect( monthsSpy ).toHaveBeenCalled();
					expect( monthsSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting the overseas regions campaigns', function(){

			it( 'Should use the campaigns transformer', function( done ){

				const regionId = '3';

				returnStub( '/os_regions/campaigns' );

				backendService.getOverseasRegionCampaigns( alice, year, regionId ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( `/mi/os_regions/${ regionId }/campaigns/?year=${ year }` );

					expect( campaignsSpy ).toHaveBeenCalled();
					expect( campaignsSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting the overseas regions top non HVCs', function(){

			it( 'Should call the correct endpoint', function( done ){

				const regionId = '4';

				returnStub( '/os_regions/top_non_hvcs' );

				backendService.getOverseasRegionTopNonHvc( alice, year, regionId ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( `/mi/os_regions/${ regionId }/top_non_hvcs/?year=${ year }` );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting the overseas regions overview', function(){

			it( 'Should use the overseas regions overview transformer', function( done ){

				returnStub( '/os_regions/overview' );

				backendService.getOverseasRegionsOverview( alice, year ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( '/mi/os_regions/overview/?year=${ year }' );

					expect( osRegionsOverviewSpy ).toHaveBeenCalled();
					expect( osRegionsOverviewSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting the list of HVC Groups', function(){

			it( 'Should return just the hvc groups', function( done ){

				returnStub( '/hvc_groups/' );

				backendService.getHvcGroups( alice, year ).then( ( hvcGroup ) => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( '/mi/hvc_groups/?year=${ year }' );

					expect( hvcGroup ).toEqual( getBackendStub( '/hvc_groups/') );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting an hvc group', function(){

			it( 'Should use the hvc group transformer', function( done ){

				const groupId = '1';

				returnStub( '/hvc_groups/group' );

				backendService.getHvcGroup( alice, year, groupId ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( `/mi/hvc_groups/${ groupId }/?year=${ year }` );

					expect( hvcGroupSpy ).toHaveBeenCalled();
					expect( hvcGroupSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting an hvc group campaigns', function(){

			it( 'Should use the campaigns transformer', function( done ){

				const groupId = '2';

				returnStub( '/hvc_groups/campaigns' );

				backendService.getHvcGroupCampaigns( alice, year, groupId ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( `/mi/hvc_groups/${ groupId }/campaigns/?year=${ year }` );

					expect( campaignsSpy ).toHaveBeenCalled();
					expect( campaignsSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done );
			} );
		} );

		describe( 'Getting an hvc group months', function(){

			it( 'Should use the months transformer', function( done ){

				const groupId = '3';

				returnStub( '/hvc_groups/months' );

				backendService.getHvcGroupMonths( alice, year, groupId ).then( () => {

					const args = backend.get.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( alice );
					expect( args[ 1 ] ).toEqual( `/mi/hvc_groups/${ groupId }/months/?year=${ year }` );

					expect( monthsSpy ).toHaveBeenCalled();
					expect( monthsSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done );
			} );
		} );
	} );

	describe( 'Aggregate methods', function(){

		let reporter;

		beforeEach( function(){

			let aggConfigStub = Object.assign( {}, configStub );
			aggConfigStub.backend.timeout = 25;

			reporter = { message: jasmine.createSpy( 'reporter.message' ) };

			stubs = {
				'../../config': aggConfigStub,
				'../logger': require( '../../../helpers/mock-logger' ),
				'../reporter': reporter
			};

			backendService = proxyquire( '../../../../../app/lib/service/service.backend', stubs );
		} );

		function intercept( files ){

			files.forEach( ( file ) => {

				let [ uri, stub, status = 200 ] = file;

				interceptBackend.getStub( uri, status, stub );
			} );
		}

		function interceptWithDelay( files ){

			const [ uri, stub, status = 200 ] = files.pop();

			intercept( files );

			interceptBackend
				.get( uri )
				.delay( 50 )
				.reply( status, getBackendStub( stub ) );
		}

		function checkReporterMessage( methodName ){

			const args = reporter.message.calls.argsFor( 0 );

			expect( reporter.message ).toHaveBeenCalled();
			expect( args[ 0 ] ).toEqual( 'info' );
			expect( args[ 1 ] ).toEqual( 'Long aggregate response time from backendService.' + methodName );
			expect( args[ 2 ].time ).toBeDefined();
			expect( args[ 2 ].name ).toEqual( methodName );
		}

		describe( 'Getting the Sector Team info', function(){

			describe( 'When all the APIs return a 200', function(){

				it( 'Should return several bits of data', function( done ){

					const teamId = 3;

					const files = [
						[ `/mi/sector_teams/${ teamId }/?year=${ year }`, '/sector_teams/sector_team' ],
						[ `/mi/sector_teams/${ teamId }/months/?year=${ year }`, '/sector_teams/months' ],
						[ `/mi/sector_teams/${ teamId }/campaigns/?year=${ year }`, '/sector_teams/campaigns' ],
						[ `/mi/sector_teams/${ teamId }/top_non_hvcs/?year=${ year }`, '/sector_teams/top_non_hvcs' ]
					];

					intercept( files );

					backendService.getSectorTeamInfo( alice, year, teamId ).then( ( data ) => {

						expect( data.wins ).toBeDefined();
						expect( data.months ).toBeDefined();
						expect( data.campaigns ).toBeDefined();
						expect( data.topNonHvc ).toBeDefined();

						done();

					} ).catch( done );
				} );
			} );

			describe( 'When one of APIs returns after a long time', function(){

				it( 'Should log a message with the reporter', function( done ){

					const teamId = 3;

					const files = [
						[ `/mi/sector_teams/${ teamId }/?year=${ year }`, '/sector_teams/sector_team' ],
						[ `/mi/sector_teams/${ teamId }/months/?year=${ year }`, '/sector_teams/months' ],
						[ `/mi/sector_teams/${ teamId }/campaigns/?year=${ year }`, '/sector_teams/campaigns' ],
						[ `/mi/sector_teams/${ teamId }/top_non_hvcs/?year=${ year }`, '/sector_teams/top_non_hvcs' ]
					];

					interceptWithDelay( files );

					backendService.getSectorTeamInfo( alice, year, teamId ).then( ( data ) => {

						checkReporterMessage( 'getSectorTeamInfo' );

						expect( data.wins ).toBeDefined();
						expect( data.months ).toBeDefined();
						expect( data.campaigns ).toBeDefined();
						expect( data.topNonHvc ).toBeDefined();

						done();

					} ).catch( done );
				} );
			} );

			describe( 'When one of the APIs returns a 500', function(){

				it( 'Should return an error', function( done ){

					const teamId = 4;

					const files = [
						[ `/mi/sector_teams/${ teamId }/?year=${ year }`, '/sector_teams/sector_team' ],
						[ `/mi/sector_teams/${ teamId }/months/?year=${ year }`, null, 500 ],
						[ `/mi/sector_teams/${ teamId }/campaigns/?year=${ year }`, '/sector_teams/campaigns' ],
						[ `/mi/sector_teams/${ teamId }/top_non_hvcs/?year=${ year }`, '/sector_teams/top_non_hvcs' ]
					];

					intercept( files );

					backendService.getSectorTeamInfo( alice, year, teamId ).then( ( data ) => {

						expect( data ).not.toBeDefined();
						done();

					} ).catch( ( err ) => {

						expect( err ).toBeDefined();
						done();
					} );
				} );
			} );

		} );

		describe( 'Getting the Overseas Region Info', function(){

			it( 'Should return several bits of data', function( done ){

				const regionId = 3;

				const files = [
					[ `/mi/os_regions/${ regionId }/?year=${ year }`, '/os_regions/region' ],
					[ `/mi/os_regions/${ regionId }/months/?year=${ year }`, '/os_regions/months' ],
					[ `/mi/os_regions/${ regionId }/campaigns/?year=${ year }`, '/os_regions/campaigns' ],
					[ `/mi/os_regions/${ regionId }/top_non_hvcs/?year=${ year }`, '/os_regions/top_non_hvcs' ]
				];

				intercept( files );

				backendService.getOverseasRegionInfo( alice, year, regionId ).then( ( data ) => {

					expect( data.wins ).toBeDefined();
					expect( data.months ).toBeDefined();
					expect( data.campaigns ).toBeDefined();
					expect( data.topNonHvc ).toBeDefined();

					done();

				} ).catch( done );
			} );

			describe( 'When one of APIs returns after a long time', function(){

				it( 'Should log a message with the reporter', function( done ){

					const regionId = 4;

					const files = [
						[ `/mi/os_regions/${ regionId }/?year=${ year }`, '/os_regions/region' ],
						[ `/mi/os_regions/${ regionId }/months/?year=${ year }`, '/os_regions/months' ],
						[ `/mi/os_regions/${ regionId }/campaigns/?year=${ year }`, '/os_regions/campaigns' ],
						[ `/mi/os_regions/${ regionId }/top_non_hvcs/?year=${ year }`, '/os_regions/top_non_hvcs' ]
					];

					interceptWithDelay( files );

					backendService.getOverseasRegionInfo( alice, year, regionId ).then( ( data ) => {

						checkReporterMessage( 'getOverseasRegionInfo' );

						expect( data.wins ).toBeDefined();
						expect( data.months ).toBeDefined();
						expect( data.campaigns ).toBeDefined();
						expect( data.topNonHvc ).toBeDefined();

						done();

					} ).catch( done );
				} );
			} );
		} );

		describe( 'Getting the HVC Group Info', function(){

			it( 'Should return several bits of data', function( done ){

				const groupId = 3;

				const files = [
					[ `/mi/hvc_groups/${ groupId }/?year=${ year }`, '/hvc_groups/group' ],
					[ `/mi/hvc_groups/${ groupId }/months/?year=${ year }`, '/hvc_groups/months' ],
					[ `/mi/hvc_groups/${ groupId }/campaigns/?year=${ year }`, '/hvc_groups/campaigns' ],
				];

				intercept( files );

				backendService.getHvcGroupInfo( alice, year, groupId ).then( ( data ) => {

					expect( data.wins ).toBeDefined();
					expect( data.months ).toBeDefined();
					expect( data.campaigns ).toBeDefined();

					done();

				} ).catch( done );
			} );

			describe( 'When one of the APIs returns after a long time', function(){

				it( 'Should log a message with the reporter', function( done ){

					const groupId = 3;

					const files = [
						[ `/mi/hvc_groups/${ groupId }/?year=${ year }`, '/hvc_groups/group' ],
						[ `/mi/hvc_groups/${ groupId }/months/?year=${ year }`, '/hvc_groups/months' ],
						[ `/mi/hvc_groups/${ groupId }/campaigns/?year=${ year }`, '/hvc_groups/campaigns' ],
					];

					interceptWithDelay( files );

					backendService.getHvcGroupInfo( alice, year, groupId ).then( ( data ) => {

						checkReporterMessage( 'getHvcGroupInfo' );

						expect( data.wins ).toBeDefined();
						expect( data.months ).toBeDefined();
						expect( data.campaigns ).toBeDefined();

						done();

					} ).catch( done );
				} );
			} );
		} );

		describe( 'Getting the Sectors List and Overseas Regions List', function(){

			describe( 'When both APIs return a 200', function(){

				it( 'Should return both bits of data', function( done ){

					const files = [
						[ '/mi/sector_teams/?year=${ year }', '/sector_teams/' ],
						[ '/mi/os_regions/?year=${ year }', '/os_regions/' ]
					];

					intercept( files );

					backendService.getSectorTeamsAndOverseasRegions( alice, year ).then( ( data ) => {

						expect( data.sectorTeams ).toBeDefined();
						expect( data.overseasRegionGroups ).toBeDefined();

						done();

					} ).catch( done );
				} );
			} );

			describe( 'When one API returns a 500', function(){

				it( 'Should throw an error', function( done ){

					const files = [
						[ '/mi/sector_teams/?year=${ year }', null, 500 ],
						[ '/mi/os_regions/?year=${ year }', '/os_regions/' ]
					];

					intercept( files );

					backendService.getSectorTeamsAndOverseasRegions( alice, year ).catch( ( err ) => {

						expect( err ).toBeDefined();
						done();

					} ).catch( done );
				} );
			} );

			describe( 'When one API returns afte a long time', function(){

				it( 'Should log a message with the reporter', function( done ){

					const files = [
						[ '/mi/sector_teams/?year=${ year }', '/sector_teams/' ],
						[ '/mi/os_regions/?year=${ year }', '/os_regions/' ]
					];

					interceptWithDelay( files );

					backendService.getSectorTeamsAndOverseasRegions( alice, year ).then( ( data ) => {

						checkReporterMessage( 'getSectorTeamsAndOverseasRegions' );

						expect( data.sectorTeams ).toBeDefined();
						expect( data.overseasRegionGroups ).toBeDefined();

						done();

					} ).catch( done );
				} );
			} );
		} );
	} );
} );
