const proxyquire = require( 'proxyquire' );

const getBackendFile = require( '../../../helpers/get-backend-file' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );
const interceptBackend = require( '../../../helpers/intercept-backend' );

const transformOverseasRegionsOverviewGroups = require( '../../../../../app/lib/transformers/os-regions-overview-groups' );

let year = '2017';
let configStub;
let stubs;
let backendService;
let monthsSpy;
let campaignsSpy;
let sectorTeamsOverviewSpy;
let osRegionsOverviewSpy;
let osRegionsOverviewGroupsSpy;
let hvcGroupSpy;
let osRegionsSpy;
let backend;
let req = {};


function returnStub( file ){

	spyOn( backend, 'sessionGet' ).and.callFake( function( alice, path, cb ){

		cb( null, { isSuccess: true, elapsedTime: 0, request: { uri: { href: 'test.com' } } }, getBackendStub( file ) );
	} );
}

function checkBackendArgs( path, req ){

	const args = backend.sessionGet.calls.argsFor( 0 );

	expect( args[ 0 ] ).toEqual( req.cookies.sessionid );
	expect( args[ 1 ] ).toEqual( path );
}

describe( 'Backend service', function(){

	let oldTimeout;

	beforeEach( function(){

		oldTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

		req = {
			cookies: { sessionid: '123abc' },
			year
		};
	} );

	afterEach( function(){

		jasmine.DEFAULT_TIMEOUT_INTERVAL = oldTimeout;
	} );

	describe( 'Single methods', function(){

		beforeEach( function(){

			configStub = { backend: { stub: false, fake: false, mock: false } };

			monthsSpy = jasmine.createSpy( 'months' );
			campaignsSpy = jasmine.createSpy( 'campaigns' );
			sectorTeamsOverviewSpy = jasmine.createSpy( 'sector-teams-overview' );
			osRegionsOverviewSpy = jasmine.createSpy( 'os-regions-overview' );
			hvcGroupSpy = jasmine.createSpy( 'hvc-group' );
			osRegionsSpy = jasmine.createSpy( 'os-regions' );

			backend = {
				get: function(){},
				sessionGet: function(){},
				sessionPost: function(){}
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
				'../backend-request': backend
			};

			backendService = proxyquire( '../../../../../app/lib/service/service.backend', stubs );
		} );

		describe( 'The date_range', function(){

			describe( 'An enpoint that has a date_range', function(){

				it( 'Should convert it from seconds to milliseconds', function( done ){

					const teamId = '3';

					returnStub( '/sector_teams/' );

					backendService.getSectorTeam( req, teamId ).then( ( data ) => {

						expect( data.date_range ).toBeDefined();
						expect( data.date_range.start ).toEqual( 1459468800 * 1000 );
						expect( data.date_range.end ).toEqual( 1483228800 * 1000 );

						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'An enpoint the does not have a date_range', function(){

				it( 'Should do nothing', function( done ){

					returnStub( '/os_regions/' );

					backendService.getOverseasRegions( req ).then( ( data ) => {

						expect( data.date_range ).not.toBeDefined();
						done();

					} ).catch( done.fail );

					done();
				} );
			} );
		} );

		describe( 'Getting the sector team', function(){

			describe( 'When the backend is available', function(){

				it( 'Should use the sector transformer', function( done ){

					const teamId = '3';

					returnStub( '/sector_teams/' );

					backendService.getSectorTeam( req, teamId ).then( () => {

						checkBackendArgs( `/mi/sector_teams/${ teamId }/?year=${ year }`, req );
						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'When the backend is not available', function(){

				it( 'Should throw an error', function( done ){

					spyOn( backend, 'sessionGet' ).and.callFake( function( alice, path, cb ){

						const err = new Error();
						err.code = 'ECONNREFUSED';

						cb( err, { isSuccess: false, elapsedTime: 0 } );
					} );

					backendService.getSectorTeam( req ).then( done.fail ).catch( ( e ) => {

						expect( e ).toEqual( new Error( 'The backend is not available.' ) );
						done();
					} );
				} );
			} );
		} );

		describe( 'Getting the sector team months', function(){

			it( 'Should use the months transformer', function( done ){

				const teamId = '4';

				returnStub( '/sector_teams/months' );

				backendService.getSectorTeamMonths( req, teamId ).then( () => {

					checkBackendArgs( `/mi/sector_teams/${ teamId }/months/?year=${ year }`, req );

					expect( monthsSpy ).toHaveBeenCalled();
					expect( monthsSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done.fail );
			} );

			describe( 'With incorrect data', function(){

				it( 'Should throw an error', function( done ){

					const stubs = {
						'../../config': configStub,
						'../logger': require( '../../../helpers/mock-logger' ),
						'../transformers/months': monthsSpy.and.callFake( () => { throw new Error( 'test' ); } ),
						'../backend-request': backend
					};

					const backendService = proxyquire( '../../../../../app/lib/service/service.backend', stubs );

					returnStub( '/sector_teams/months' );

					backendService.getSectorTeamMonths( req, 1 ).then( done.fail ).catch( ( e ) => {

						expect( e ).toEqual( new Error( 'Unable to transform API response' ) );
						done();
					} );
				} );
			} );
		} );

		describe( 'Getting the sector team campaigns', function(){

			it( 'Should use the campaigns transformer', function( done ){

				const teamId = '5';

				returnStub( '/sector_teams/campaigns' );

				backendService.getSectorTeamCampaigns( req, teamId ).then( () => {

					checkBackendArgs( `/mi/sector_teams/${ teamId }/campaigns/?year=${ year }`, req );

					expect( campaignsSpy ).toHaveBeenCalled();
					expect( campaignsSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the sector team top non HVCs', function(){

			it( 'Should use the call the correct endpoint', function( done ){

				const teamId = '5';

				returnStub( '/sector_teams/top_non_hvcs' );

				backendService.getSectorTeamTopNonHvc( req, teamId ).then( () => {

					checkBackendArgs( `/mi/sector_teams/${ teamId }/top_non_hvcs/?year=${ year }`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the sector team overview', function(){

			it( 'Should use the sector teams overview transformer', function( done ){

				returnStub( '/sector_teams/overview' );

				backendService.getSectorTeamsOverview( req ).then( () => {

					checkBackendArgs( `/mi/sector_teams/overview/?year=${ year }`, req );

					expect( sectorTeamsOverviewSpy ).toHaveBeenCalled();
					expect( sectorTeamsOverviewSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the overseas regions list', function(){

			it( 'Should use the os-regions transformer', function( done ){

				returnStub( '/os_regions/' );

				backendService.getOverseasRegions( req ).then( () => {

					checkBackendArgs( `/mi/os_regions/?year=${ year }`, req );

					expect( osRegionsSpy ).not.toHaveBeenCalled();
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the Grouped overseas regions list', function(){

			it( 'Should call the correct API', function( done ){

				returnStub( '/os_region_groups/index.2017' );

				backendService.getOverseasRegionGroups( req ).then( () => {

					checkBackendArgs( `/mi/os_region_groups/?year=${ year }`, req );

					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the overseas region', function(){

			it( 'Should use the sector transformer', function( done ){

				const regionId = '1';

				returnStub( '/os_regions/region' );

				backendService.getOverseasRegion( req, regionId ).then( () => {

					checkBackendArgs( `/mi/os_regions/${ regionId }/?year=${ year }`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the overseas regions months', function(){

			it( 'Should use the months transformer', function( done ){

				const regionId = '2';

				returnStub( '/os_regions/months' );

				backendService.getOverseasRegionMonths( req, regionId ).then( () => {

					checkBackendArgs( `/mi/os_regions/${ regionId }/months/?year=${ year }`, req );

					expect( monthsSpy ).toHaveBeenCalled();
					expect( monthsSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the overseas regions campaigns', function(){

			it( 'Should use the campaigns transformer', function( done ){

				const regionId = '3';

				returnStub( '/os_regions/campaigns' );

				backendService.getOverseasRegionCampaigns( req, regionId ).then( () => {

					checkBackendArgs( `/mi/os_regions/${ regionId }/campaigns/?year=${ year }`, req );

					expect( campaignsSpy ).toHaveBeenCalled();
					expect( campaignsSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the overseas regions top non HVCs', function(){

			it( 'Should call the correct endpoint', function( done ){

				const regionId = '4';

				returnStub( '/os_regions/top_non_hvcs' );

				backendService.getOverseasRegionTopNonHvc( req, regionId ).then( () => {

					checkBackendArgs( `/mi/os_regions/${ regionId }/top_non_hvcs/?year=${ year }`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the overseas regions overview', function(){

			it( 'Should use the overseas regions overview transformer', function( done ){

				returnStub( '/os_regions/overview.2016' );

				backendService.getOverseasRegionsOverview( req ).then( () => {

					checkBackendArgs( `/mi/os_regions/overview/?year=${ year }`, req );

					expect( osRegionsOverviewSpy ).toHaveBeenCalled();
					expect( osRegionsOverviewSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the HVC detail', function(){

			it( 'Should return the hvc detail', function( done ){

				const hvcId = 'E100';

				returnStub( '/hvc/hvc' );

				backendService.getHvc( req, hvcId ).then( ( hvcInfo ) => {

					checkBackendArgs( `/mi/hvc/${ hvcId }/?year=${ year }`, req );

					expect( hvcInfo ).toBeDefined();
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the HVC markets', function(){

			it( 'Should return the hvc markets', function( done ){

				const hvcId = 'E100';

				returnStub( '/hvc/markets' );

				backendService.getHvcMarkets( req, hvcId ).then( ( marketInfo ) => {

					checkBackendArgs( `/mi/hvc/${ hvcId }/top_wins/?year=${ year }`, req );

					expect( marketInfo ).toBeDefined();
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the global HVCs', function(){

			it( 'Should return the global HVCs', function( done ){

				returnStub( '/global_hvcs/' );

				backendService.getGlobalHvcs( req ).then( ( hvcs ) => {

					checkBackendArgs( `/mi/global_hvcs/?year=${ year }`, req );

					const globalHvcData = getBackendStub( '/global_hvcs/' );

					globalHvcData.date_range.start = ( globalHvcData.date_range.start * 1000 );
					globalHvcData.date_range.end = ( globalHvcData.date_range.end * 1000 );

					expect( hvcs ).toEqual( globalHvcData );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the list of HVC Groups', function(){

			it( 'Should return just the hvc groups', function( done ){

				returnStub( '/hvc_groups/' );

				backendService.getHvcGroups( req ).then( ( hvcGroup ) => {

					checkBackendArgs( `/mi/hvc_groups/?year=${ year }`, req );

					expect( hvcGroup ).toEqual( getBackendStub( '/hvc_groups/') );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting an hvc group', function(){

			it( 'Should use the hvc group transformer', function( done ){

				const groupId = '1';

				returnStub( '/hvc_groups/group' );

				backendService.getHvcGroup( req, groupId ).then( () => {

					checkBackendArgs( `/mi/hvc_groups/${ groupId }/?year=${ year }`, req );

					expect( hvcGroupSpy ).toHaveBeenCalled();
					expect( hvcGroupSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting an hvc group campaigns', function(){

			it( 'Should use the campaigns transformer', function( done ){

				const groupId = '2';

				returnStub( '/hvc_groups/campaigns' );

				backendService.getHvcGroupCampaigns( req, groupId ).then( () => {

					checkBackendArgs( `/mi/hvc_groups/${ groupId }/campaigns/?year=${ year }`, req );

					expect( campaignsSpy ).toHaveBeenCalled();
					expect( campaignsSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting an hvc group months', function(){

			it( 'Should use the months transformer', function( done ){

				const groupId = '3';

				returnStub( '/hvc_groups/months' );

				backendService.getHvcGroupMonths( req, groupId ).then( () => {

					checkBackendArgs( `/mi/hvc_groups/${ groupId }/months/?year=${ year }`, req );

					expect( monthsSpy ).toHaveBeenCalled();
					expect( monthsSpy.calls.count() ).toEqual( 1 );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the user info', function(){

			describe( 'When the user is not in the interal users list', function(){

				it( 'Should set the internal flag to false and return the user info', function( done ){

					const userStub = getBackendStub( '/user/me' );
					userStub.internal = false;

					returnStub( '/user/me' );

					backendService.getUserInfo( req ).then( ( user ) => {

						expect( user ).toEqual( userStub );
						done();
					} );
				} );
			} );

			describe( 'When the user is in the internal users list', function(){

				function setInternalUsers( str ){

					configStub.internalUsers = str;

					stubs[ '../../config' ] = configStub;

					backendService = proxyquire( '../../../../../app/lib/service/service.backend', stubs );
				}

				function testUser( done ){

					const userStub = getBackendStub( '/user/me.internal' );
					userStub.internal = true;

					returnStub( '/user/me.internal' );

					backendService.getUserInfo( req ).then( ( user ) => {

						expect( user ).toEqual( userStub );
						done();
					} );
				}

				describe( 'When the list is just one item', function(){

					it( 'Should set the internal flag to true and return the user info', function( done ){

						setInternalUsers( 'Brianne31@gmail.com' );
						testUser( done );
					} );
				} );

				describe( 'When the list has many items', function(){

					it( 'Should set the internal flag to true and return the user info', function( done ){

						setInternalUsers( 'Brianne31@gmail.com,test@test.com' );
						testUser( done );
					} );
				} );
			} );
		} );

		describe( 'SAML metadata', function(){

			it( 'Should return the metadata', function( done ){

				spyOn( backend, 'sessionGet' ).and.callFake( function( sessionId, path, cb ){

					cb( null, { isSuccess: true, elapsedTime: 0 }, getBackendFile( '/saml2/metadata.xml' ) );
				} );

				backendService.getSamlMetadata( req ).then( () => {

					checkBackendArgs( `/saml2/metadata/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'SAML acs', function(){

			const xml = '<xml response="true"/>';
			const session_id = '1234';
			const successResponse = {
				isSuccess: true,
				elapsedTime: 0,
				headers: { 'set-cookie': `sessionid=${ session_id }` }
			};

			it( 'Should post the XML', function( done ){

				const responseBody = 'success';
				req.data = xml;

				spyOn( backend, 'sessionPost' ).and.callFake( function( sessionId, path, body, cb ){

					cb( null, successResponse, responseBody );
				} );

				backendService.sendSamlXml( req ).then( ( info ) => {

					const args = backend.sessionPost.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( req.cookies.sessionid );
					expect( args[ 1 ] ).toEqual( '/saml2/acs/' );
					expect( args[ 2 ] ).toEqual( xml );

					expect( info.response ).toEqual( successResponse );
					expect( info.data ).toEqual( responseBody );
					done();

				} ).catch( done.fail );
			} );

			describe( 'When the response is not success', function(){

				it( 'Should reject with an error', function( done ){

					const responseBody = '{ "code": 1, "message": "not in MI group" }';
					const response403 = {
						isSuccess: false,
						statusCode: 403,
						elapsedTime: 0,
						headers: {
							'set-cookie': `sessionid=${ session_id }`,
							'content-type': 'application/json'
						},
						request: { uri: { href: '' } }
					};
					req.data = xml;

					spyOn( backend, 'sessionPost' ).and.callFake( function( sessionId, path, body, cb ){

						cb( null, response403, responseBody );
					} );

					backendService.sendSamlXml( req ).then( done.fail ).catch( ( e ) => {

						expect( e.code ).toEqual( 403 );
						expect( e.response ).toEqual( response403 );
						expect( e.data ).toEqual( responseBody );
						done();
					} );
				} );
			} );
		} );

		describe( 'SAML Login', function(){

			describe( 'When the response is a success', function(){

				it( 'Should return the response from the backend', function( done ){

					const responseBody = 'abc123';

					spyOn( backend, 'sessionGet' ).and.callFake( function( sessionId, path, cb ){

						cb( null, { isSuccess: true, elapsedTime: 100 }, responseBody );
					} );

					backendService.getSamlLogin( req ).then( ( info ) => {

						checkBackendArgs( '/saml2/login/', req );
						expect( info.data ).toEqual( responseBody );
						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'When the response is not a success', function(){

				it( 'Should throw an error', function( done ){

					spyOn( backend, 'sessionGet' ).and.callFake( function( sessionId, path, cb ){

						cb( null, { isSuccess: false, elapsedTime: 100, request: { uri: { href: '' } } }, '' );
					} );

					backendService.getSamlLogin( req ).then( done.fail ).catch( ( e ) => {

						expect( e ).toEqual( new Error( 'Not a successful response from the backend.' ) );
						done();
					} );
				} );
			} );

			describe( 'When the request has an error', function(){

				it( 'Should throw an error', function( done ){

					spyOn( backend, 'sessionGet' ).and.callFake( function( sessionId, path, cb ){

						cb( new Error( 'error' ), { isSuccess: false, elapsedTime: 100, request: { uri: { href: '' } } }, '' );
					} );

					backendService.getSamlLogin( req ).then( done.fail ).catch( ( e ) => {

						expect( e ).toEqual( new Error( 'error' ) );
						done();
					} );
				} );
			} );
		} );
	} );


	describe( 'Aggregate methods', function(){

		let reporter;

		beforeEach( function(){

			let aggConfigStub = Object.assign( {}, configStub );
			aggConfigStub.backend.timeout = 25;

			osRegionsOverviewGroupsSpy = jasmine.createSpy( 'os-regions-overview-groups', transformOverseasRegionsOverviewGroups ).and.callThrough();
			reporter = { message: jasmine.createSpy( 'reporter.message' ) };

			stubs = {
				'../../config': aggConfigStub,
				'../logger': require( '../../../helpers/mock-logger' ),
				'../reporter': reporter,
				'../transformers/os-regions-overview-groups': osRegionsOverviewGroupsSpy
			};

			backendService = proxyquire( '../../../../../app/lib/service/service.backend', stubs );
		} );

		function intercept( files ){

			files.forEach( ( file ) => {

				const [ uri, stub, status = 200 ] = file;

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

					backendService.getSectorTeamInfo( req, teamId ).then( ( data ) => {

						expect( data.wins ).toBeDefined();
						expect( data.months ).toBeDefined();
						expect( data.campaigns ).toBeDefined();
						expect( data.topNonHvc ).toBeDefined();

						done();

					} ).catch( done.fail );
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

					backendService.getSectorTeamInfo( req, teamId ).then( ( data ) => {

						checkReporterMessage( 'getSectorTeamInfo' );

						expect( data.wins ).toBeDefined();
						expect( data.months ).toBeDefined();
						expect( data.campaigns ).toBeDefined();
						expect( data.topNonHvc ).toBeDefined();

						done();

					} ).catch( done.fail );
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

					backendService.getSectorTeamInfo( req, teamId ).then( ( data ) => {

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

				backendService.getOverseasRegionInfo( req, regionId ).then( ( data ) => {

					expect( data.wins ).toBeDefined();
					expect( data.months ).toBeDefined();
					expect( data.campaigns ).toBeDefined();
					expect( data.topNonHvc ).toBeDefined();

					done();

				} ).catch( done.fail );
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

					backendService.getOverseasRegionInfo( req, regionId ).then( ( data ) => {

						checkReporterMessage( 'getOverseasRegionInfo' );

						expect( data.wins ).toBeDefined();
						expect( data.months ).toBeDefined();
						expect( data.campaigns ).toBeDefined();
						expect( data.topNonHvc ).toBeDefined();

						done();

					} ).catch( done.fail );
				} );
			} );
		} );

		describe( 'Getting the overseas regions overview groups', function(){

			it( 'Should get the OS groups and OS overview and merge them', function( done ){

				const files = [
					[ `/mi/os_regions/overview/?year=${ year }`, '/os_regions/overview.2017' ],
					[ `/mi/os_region_groups/?year=${ year }`, '/os_region_groups/index.2017' ]
				];

				intercept( files );

				backendService.getOverseasRegionsOverviewGroups( req ).then( ( items ) => {

					expect( items ).toBeDefined();
					expect( osRegionsOverviewGroupsSpy ).toHaveBeenCalled();
					expect( osRegionsOverviewGroupsSpy.calls.count() ).toEqual( 1 );

					done();

				} ).catch( done.fail );
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

				backendService.getHvcGroupInfo( req, groupId ).then( ( data ) => {

					expect( data.wins ).toBeDefined();
					expect( data.months ).toBeDefined();
					expect( data.campaigns ).toBeDefined();

					done();

				} ).catch( done.fail );
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

					backendService.getHvcGroupInfo( req, groupId ).then( ( data ) => {

						checkReporterMessage( 'getHvcGroupInfo' );

						expect( data.wins ).toBeDefined();
						expect( data.months ).toBeDefined();
						expect( data.campaigns ).toBeDefined();

						done();

					} ).catch( done.fail );
				} );
			} );
		} );

		describe( 'Getting the home page data', function(){

			describe( 'When all APIs return a 200', function(){

				it( 'Should return all bits of data', function( done ){

					const files = [
						[ `/mi/sector_teams/?year=${ year }`, '/sector_teams/' ],
						[ `/mi/os_region_groups/?year=${ year }`, '/os_region_groups/index.2017' ],
						[ `/mi/global_hvcs/?year=${ year }`, '/global_hvcs/' ]
					];

					intercept( files );

					backendService.getHomepageData( req ).then( ( data ) => {

						expect( data.sectorTeams ).toBeDefined();
						expect( data.overseasRegionGroups ).toBeDefined();
						expect( data.globalHvcs ).toBeDefined();

						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'When one API returns a 500', function(){

				it( 'Should throw an error', function( done ){

					const files = [
						[ `/mi/sector_teams/?year=${ year }`, null, 500 ],
						[ `/mi/os_region_groups/?year=${ year }`, '/os_region_groups/index.2017' ],
						[ `/mi/global_hvcs/?year=${ year }`, '/global_hvcs/' ]
					];

					intercept( files );

					backendService.getHomepageData( req ).catch( ( err ) => {

						expect( err ).toBeDefined();
						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'When one API returns after a long time', function(){

				it( 'Should log a message with the reporter', function( done ){

					const files = [
						[ `/mi/sector_teams/?year=${ year }`, '/sector_teams/' ],
						[ `/mi/os_region_groups/?year=${ year }`, '/os_region_groups/index.2017' ],
						[ `/mi/global_hvcs/?year=${ year }`, '/global_hvcs/' ]
					];

					interceptWithDelay( files );

					backendService.getHomepageData( req ).then( ( data ) => {

						checkReporterMessage( 'getHomepageData' );

						expect( data.sectorTeams ).toBeDefined();
						expect( data.overseasRegionGroups ).toBeDefined();
						expect( data.globalHvcs ).toBeDefined();

						done();

					} ).catch( done.fail );
				} );
			} );
		} );

		describe( 'Getting the HVC Info', function(){

			describe( 'When both APIs return a 200', function(){

				it( 'Should return both bits of data', function( done ){

					const hvcId = 'E100';
					const files = [
						[ `/mi/hvc/${ hvcId }/?year=${ year }`, '/hvc/hvc' ],
						[ `/mi/hvc/${ hvcId }/top_wins/?year=${ year }`, '/hvc/markets' ]
					];

					intercept( files );

					backendService.getHvcInfo( req, hvcId ).then( ( data ) => {

						expect( data.hvc ).toBeDefined();
						expect( data.markets ).toBeDefined();

						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'When one API returns a 500', function(){

				it( 'Should throw an error', function( done ){

					const hvcId = 'E100';
					const files = [
						[ `/mi/hvc/${ hvcId }/?year=${ year }`, null, 500 ],
						[ `/mi/hvc/${ hvcId }/top_wins/?year=${ year }`, '/hvc/markets' ]
					];

					intercept( files );

					backendService.getHvcInfo( req, hvcId ).catch( ( err ) => {

						expect( err ).toBeDefined();
						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'When one API returns after a long time', function(){

				it( 'Should log a message with the reporter', function( done ){

					const hvcId = 'E100';
					const files = [
						[ `/mi/hvc/${ hvcId }/?year=${ year }`, '/hvc/hvc' ],
						[ `/mi/hvc/${ hvcId }/top_wins/?year=${ year }`, '/hvc/markets' ]
					];

					interceptWithDelay( files );

					backendService.getHvcInfo( req, hvcId ).then( ( data ) => {

						checkReporterMessage( 'getHvcInfo' );

						expect( data.hvc ).toBeDefined();
						expect( data.markets ).toBeDefined();

						done();

					} ).catch( done.fail );
				} );
			} );
		} );
	} );

	describe( 'Stubbed mode', function(){

		it( 'Should use the stubbed backend-request', function( done ){

			const stubbedBackendRequest = {
				sessionGet: jasmine.createSpy( 'backend-request.stub.sessionGet' ).and.callFake( ( sessionId, path, cb ) => cb( null, { isSuccess: true, request:{ uri: {} } }, {} ) )
			};
			const backendService = proxyquire( '../../../../../app/lib/service/service.backend', {
				'../backend-request.stub': stubbedBackendRequest,
				'../../config': { backend: { stub: true, fake: false, mock: false } }
			} );

			backendService.getSectorTeams( req ).then( () => {

				expect( stubbedBackendRequest.sessionGet ).toHaveBeenCalled();
				done();

			} ).catch( done.fail );
		} );
	} );

	describe( 'Mocked mode', function(){

		it( 'Should require the mocks', function(){

			const win = jasmine.createSpy( 'win' );

			const backendService = proxyquire( '../../../../../app/lib/service/service.backend', {
				'../../config': { backend: { stub: false, fake: false, mock: true } },
				'../../../data/mocks': {
					win
				}
			} );

			backendService.getWin();
			expect( win ).toHaveBeenCalled();
		} );
	} );
} );
