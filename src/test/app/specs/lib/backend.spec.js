const proxyquire = require( 'proxyquire' );
const interceptBackend = require( '../../helpers/intercept-backend' );

let request;
let reporter;
let logger;
let createSignature;
let backend;

const timeout = 500;
const href = 'testing.local';
const path = '/test';
const alice ={ session: 'alice-session' };

function createBackend( opts = {} ){

	backend = proxyquire( '../../../../app/lib/backend', {
		'request': opts.request || request,
		'./reporter': opts.reporter || reporter,
		'./logger': opts.logger || logger,
		'./create-signature': opts.createSignature || createSignature,
		'../config':  opts.config || { backend: { stub: true, fake: false, href, timeout } }
	} );
}

describe( 'Backend lib', function(){

	let oldTimeout;

	beforeEach( function(){

		oldTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
	} );

	afterEach( function(){

		jasmine.DEFAULT_TIMEOUT_INTERVAL = oldTimeout;
	} );

	describe( 'GET request', function(){

		beforeEach( function(){

			reporter = {
				message: jasmine.createSpy( 'reporter.message' )
			};

			logger = {
				warn: jasmine.createSpy( 'logger.warn' ),
				error: jasmine.createSpy( 'logger.error' ),
				debug: jasmine.createSpy( 'logger.debug' )
			};

			request = jasmine.createSpy( 'request' );
			createSignature = jasmine.createSpy( 'createSignature' ).and.callFake( function(){ return 'test-hash'; } );

			createBackend();
		} );

		it( 'Should call request with the correct options', function( done ){

			request.and.callFake( function( opts, cb ){
				cb( null, {
					statusCode: 200,
					elapsedTime: 100,
					headers: {
						'content-type': 'application/json'
					},
					request: { uri: { href: '/test' } }
				}, '{ "test": "testing" }' );
			} );

			backend.get( alice, path, function(){

				expect( request.calls.argsFor( 0 )[ 0 ] ).toEqual( {
					url: ( href + path ),
					time: true,
					method: 'GET',
					headers: {
						'X-Signature': 'test-hash',
						'Cookie': ( 'sessionid=' + alice.session )
					}
				} );
				done();
			} );
		} );

		describe( 'A slow request', function(){

			it( 'Should log an event with the reporter', function( done ){

				request.and.callFake( function( opts, cb ){
					cb( null, {
						statusCode: 200,
						elapsedTime: 1000,
						headers: {},
						request: { uri: { path: '/test' } }
					}, '{ "test": "testing" }' );
				} );

				backend.get( alice, path, function( err, response ){

					expect( reporter.message ).toHaveBeenCalledWith( 'info', 'Long response time from backend API: /test', {
						time: response.elapsedTime,
						path: response.request.uri.path
					} );

					done();
				} );
			} );
		} );

		describe( 'A successful request', function(){

			beforeEach( function(){

				request.and.callFake( function( opts, cb ){
					cb( null, {
						statusCode: 200,
						elapsedTime: 100,
						headers: {
							'content-type': 'application/json'
						},
						request: { uri: { path: '/test' } }
					}, '{ "test": "testing" }' );
				} );
			} );

			describe( 'With a JSON response', function(){

				describe( 'When the response is valid JSON', function(){

					it( 'Should return the response as a JSON object', function( done ){

						backend.get( alice, path, function( err, response, data ){

							expect( request ).toHaveBeenCalled();
							expect( err ).toBeNull();
							expect( response.isSuccess ).toEqual( true );
							expect( Object.prototype.toString.call( data ) ).toEqual( '[object Object]' );
							expect( data ).toEqual( { test: 'testing' } );
							done();
						} );
					} );
				} );

				describe( 'When the response is not valid JSON', function(){

					it( 'Should log an error and return the response data as is', function( done ){

						request.and.callFake( function( opts, cb ){
							cb( null, {
								statusCode: 200,
								elapsedTime: 100,
								headers: {
									'content-type': 'application/json'
								},
								request: { uri: { href: '/test' } }
							}, '"test": "testing"' );
						} );

						backend.get( alice, path, function( err, response, data ){

							expect( request ).toHaveBeenCalled();
							expect( err ).toBeNull();
							expect( response.isSuccess ).toEqual( true );
							expect( logger.error ).toHaveBeenCalledWith( 'Unable to convert response to JSON for uri: %s', response.request.uri.href );
							expect( Object.prototype.toString.call( data ) ).toEqual( '[object String]' );
							expect( data ).toEqual( '"test": "testing"' );
							done();
						} );
					} );
				} );
			} );

			describe( 'A text/plain response', function(){

				it( 'Should return the response', function( done ){

				request.and.callFake( function( opts, cb ){
						cb( null, {
							statusCode: 200,
							elapsedTime: 100,
							headers: {
								'content-type': 'text/plain'
							},
							request: { uri: { path: '/test' } }
						}, 'test' );
					} );

					backend.get( alice, path, function( err, response, data ){

						expect( request ).toHaveBeenCalled();
						expect( err ).toBeNull();
						expect( response.isSuccess ).toEqual( true );
						expect( logger.error ).not.toHaveBeenCalled();
						expect( Object.prototype.toString.call( data ) ).toEqual( '[object String]' );
						expect( data ).toEqual( 'test' );
						done();
					} );
				} );
			} );
		} );

		describe( 'A failed request', function(){

			describe( 'A network timeout', function(){

				it( 'Should return the error', function( done ){

					request.and.callFake( function( opts, cb ){

						let err = new Error( 'Network failed' );
						err.code = 'ECONNREFUSED';
						cb( err );
					} );

					backend.get( alice, path, function( err, response, data ){

						expect( request ).toHaveBeenCalled();
						expect( err ).toBeDefined();
						expect( err.code ).toEqual( 'ECONNREFUSED' );
						expect( response ).toBeUndefined();
						expect( logger.error ).not.toHaveBeenCalled();
						expect( logger.warn ).not.toHaveBeenCalled();
						expect( data ).toBeUndefined();
						done();
					} );
				} );
			} );
		} );
	} );

	describe( 'Intercepted request', function(){

		beforeEach( function(){

			backend = require( '../../../../app/lib/backend' );
		} );

		describe( 'A 200 response', function(){

			it( 'Should return the JSON', function( done ){

				interceptBackend.getStub( path, 200, '/sector_teams/' );

				backend.get( alice, path, function( err, response, data ){

					expect( err ).toBeNull();
					expect( response.statusCode ).toEqual( 200 );
					expect( response.isSuccess ).toEqual( true );
					expect( typeof data ).toEqual( 'object' );
					done();
				} );
			} );
		} );

		describe( 'A 500 response', function(){

			it( 'Should return an error', function( done ){

				interceptBackend.get( path ).reply( 500 );

				backend.get( alice, path, function( err, response, data ){

					expect( err ).toBeDefined();
					expect( response.statusCode ).toEqual( 500 );
					expect( response.isSuccess ).toEqual( false );
					expect( data ).toEqual( '' );
					done();
				} );
			} );
		} );

		describe( 'A 404 response', function(){

			it( 'Should return an error', function( done ){

				interceptBackend.get( path ).reply( 404, 'not found' );

				backend.get( alice, path, function( err, response, data ){

					expect( err ).toBeDefined();
					expect( response.statusCode ).toEqual( 404 );
					expect( response.isSuccess ).toEqual( false );
					expect( data ).toEqual( 'not found' );
					done();
				} );
			} );
		} );
	} );
} );
