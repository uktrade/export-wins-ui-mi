const proxyquire = require( 'proxyquire' );

const getBackendStub = require( '../../../../helpers/get-backend-stub' );

const modulePath = '../../../../../../app/lib/service/service.backend';

let req;
let helpers;
let backendService;
let configStub;
let stubs;
let csvTransformer;

function returnStub( file ){

	helpers.sessionGet.and.callFake( function(){

		return new Promise( ( resolve ) => resolve( {

			response: { isSuccess: true, elapsedTime: 0, request: { uri: { href: 'test.com' } } },
			data: getBackendStub( file )

		} ) );
	} );
}

describe( 'Backend service', function(){

	let oldTimeout;

	beforeEach( function(){

		oldTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

		req = {
			cookies: { sessionid: '123abc' },
			year: '2017'
		};

		helpers = {
			sessionGet: jasmine.createSpy( 'helpers.sessionGet' ),
			sessionPost: jasmine.createSpy( 'helpers.sessionPost' ),
			get: jasmine.createSpy( 'helpers.get' ),
			post: jasmine.createSpy( 'helpers.post' )
		};

		csvTransformer = jasmine.createSpy( 'csvTransformer' ).and.callFake( ( input ) => input );

		configStub = { isDev: false, backend: { stub: false, fake: false, mock: false } };

		stubs = {
			'../../../config': configStub,
			'./_helpers': helpers,
			'../../transformers/csv-files': csvTransformer
		};

		backendService = proxyquire( modulePath, stubs );
	} );

	afterEach( function(){

		jasmine.DEFAULT_TIMEOUT_INTERVAL = oldTimeout;
	} );

	describe( 'CSV Files', function(){

		describe( 'Getting the list of files', function(){

			it( 'Should return the list', function( done ){

				const responseBody = { id: 1, created: '2017-11-02T14:18:43.631943Z' };
				const response = { response: null, data: responseBody };

				helpers.sessionGet.and.callFake( () => new Promise( ( resolve ) => resolve( response ) ) );

				backendService.getCsvFileList( req ).then( ( info ) => {

					const args = helpers.sessionGet.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( '/csv/all_files/' );
					expect( args[ 1 ] ).toEqual( req );
					expect( info.data ).toEqual( responseBody );
					expect( csvTransformer ).toHaveBeenCalledWith( response );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting a URL for the file', function(){

			it( 'Should return the URL', function( done ){

				const fileId = '1';
				const responseBody = { id: 1, one_time_url: 'https://someurl.com' };

				helpers.sessionGet.and.callFake( () => new Promise( ( resolve ) => {

						resolve( { response: null, data: responseBody } );
					} )
				);

				backendService.getCsvFileUrl( req, fileId ).then( ( info ) => {

					const args = helpers.sessionGet.calls.argsFor( 0 );

					expect( args[ 0 ] ).toEqual( `/csv/generate_otu/${ fileId }/` );
					expect( args[ 1 ] ).toEqual( req );
					expect( info.data ).toEqual( responseBody );
					done();
				} );
			} );
		} );
	} );

	describe( 'OAuth login', function(){

		describe( 'When the response is a success', function(){

			describe( 'When calling with a next param', function(){

				it( 'Should call the URL with a next param and return the response from the backend', function( done ){

					const nextUrl = '/my/url/?aparam=true';
					const responseBody = 'abc123';

					helpers.get.and.callFake( function(){

						return new Promise( ( resolve ) => resolve( { data: responseBody } ) );
					} );

					backendService.getOauthUrl( nextUrl ).then( ( info ) => {

						const args = helpers.get.calls.argsFor( 0 );

						expect( args[ 0 ] ).toEqual( `/oauth2/auth_url/?next=${ encodeURIComponent( nextUrl ) }` );
						expect( info.data ).toEqual( responseBody );
						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'When calling with no params', function(){

				it( 'Should call the default URL and return the response from the backend', function( done ){

					const responseBody = 'abc123';

					helpers.get.and.callFake( function(){

						return new Promise( ( resolve ) => resolve( { data: responseBody } ) );
					} );

					backendService.getOauthUrl().then( ( info ) => {

						const args = helpers.get.calls.argsFor( 0 );

						expect( args[ 0 ] ).toEqual( '/oauth2/auth_url/' );
						expect( info.data ).toEqual( responseBody );
						done();

					} ).catch( done.fail );
				} );
			} );

		} );

		describe( 'When the response is not a success', function(){

			it( 'Should throw an error', function( done ){

				const err = new Error( 'test' );

				helpers.get.and.callFake( function(){

					return new Promise( ( resolve, reject ) => reject( err ) );
				} );

				backendService.getOauthUrl( req ).then( done.fail ).catch( ( e ) => {

					expect( e ).toEqual( err );
					done();
				} );
			} );
		} );
	} );

	describe( 'postOauthCallback', function(){

		it( 'Should POST the params to the correct url', function( done ){

			const params = { code: 1, status: 2 };
			const responseBody = 'abc123';

			helpers.post.and.callFake( function(){

				return new Promise( ( resolve ) => resolve( { data: responseBody } ) );
			} );

			backendService.postOauthCallback( params ).then( ( /* info */ ) => {

				const args = helpers.post.calls.argsFor( 0 );

				expect( args[ 0 ] ).toEqual( '/oauth2/callback/' );
				expect( args[ 1 ] ).toEqual( params );
				done();

			} ).catch( done.fail );
		} );
	} );

	describe( 'Getting the user info', function(){

		describe( 'In dev mode', function(){

			it( 'Should set the internal flag to true', function( done ){

				const userStub = getBackendStub( '/user/me' );

				userStub.internal = true;

				configStub.isDev = true;

				backendService = proxyquire( modulePath, stubs );

				returnStub( '/user/me' );

				backendService.getUserInfo( req ).then( ( user ) => {

					expect( user ).toEqual( userStub );
					done();
				} );
			} );
		} );

		describe( 'Not in dev mode', function(){

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

					stubs[ '../../../config' ] = configStub;

					backendService = proxyquire( modulePath, stubs );
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
	} );
} );
