const proxyquire = require( 'proxyquire' );

const getBackendFile = require( '../../../../helpers/get-backend-file' );
const getBackendStub = require( '../../../../helpers/get-backend-stub' );

let req;
let helpers;
let backendService;
let configStub;
let stubs;

function returnStub( file ){

	helpers.sessionGet.and.callFake( function(){

		return new Promise( ( resolve ) => resolve( {

			response: { isSuccess: true, elapsedTime: 0, request: { uri: { href: 'test.com' } } },
			data: getBackendStub( file )

		} ) );
	} );
}

function checkBackendArgs( path, req ){

	const args = helpers.sessionGet.calls.argsFor( 0 );

	expect( args[ 0 ] ).toEqual( path );
	expect( args[ 1 ] ).toEqual( req );
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

		configStub = { backend: { stub: false, fake: false, mock: false } };

		stubs = {
			'../../../config': configStub,
			'./_helpers': helpers
		};

		backendService = proxyquire( '../../../../../../app/lib/service/service.backend', stubs );
	} );

	afterEach( function(){

		jasmine.DEFAULT_TIMEOUT_INTERVAL = oldTimeout;
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

	describe( 'SAML Login', function(){

		describe( 'When the response is a success', function(){

			it( 'Should return the response from the backend', function( done ){

				const responseBody = 'abc123';

				helpers.sessionGet.and.callFake( function(){

					return new Promise( ( resolve ) => resolve( { data: responseBody } ) );
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

				const err = new Error( 'test' );

				helpers.sessionGet.and.callFake( function(){

					return new Promise( ( resolve, reject ) => reject( err ) );
				} );

				backendService.getSamlLogin( req ).then( done.fail ).catch( ( e ) => {

					expect( e ).toEqual( err );
					done();
				} );
			} );
		} );
	} );

	describe( 'SAML metadata', function(){

		it( 'Should return the metadata', function( done ){

			const xml = getBackendFile( '/saml2/metadata.xml' ).toString();

			helpers.sessionGet.and.callFake( function(){

				return new Promise( ( resolve ) => resolve( { data: xml } ) );
			} );

			backendService.getSamlMetadata( req ).then( ( data ) => {

				checkBackendArgs( `/saml2/metadata/`, req );
				expect( data ).toEqual( xml );
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

			helpers.sessionPost.and.callFake( () => new Promise( ( resolve ) => {
					resolve( { response: successResponse, data: responseBody } );
				} )
			);

			backendService.sendSamlXml( req ).then( ( info ) => {

				const args = helpers.sessionPost.calls.argsFor( 0 );

				expect( args[ 0 ] ).toEqual( '/saml2/acs/' );
				expect( args[ 1 ] ).toEqual( req );
				expect( args[ 2 ] ).toEqual( xml );

				expect( info.response ).toEqual( successResponse );
				expect( info.data ).toEqual( responseBody );
				done();

			} ).catch( done.fail );
		} );

		describe( 'When the response is not success', function(){

			it( 'Should reject with an error', function( done ){

				req.data = xml;

				const err = new Error( 'fail POST' );

				helpers.sessionPost.and.callFake( () => new Promise( ( resolve, reject ) => {
						reject( err );
					} )
				);

				backendService.sendSamlXml( req ).then( done.fail ).catch( ( e ) => {

					expect( e ).toEqual( err );
					done();
				} );
			} );
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

				backendService = proxyquire( '../../../../../../app/lib/service/service.backend', stubs );
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
