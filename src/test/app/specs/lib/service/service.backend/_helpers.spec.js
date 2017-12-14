const proxyquire = require( 'proxyquire' );

const spyLogger = require( '../../../../helpers/spy-logger' );
const spy = require( '../../../../helpers/spy' );

let reporter;
let logger;
let helpers;
let req;
let sessionid;

const backendTimeout = 50;
const year = 2017;
const path = '/my/test/';
const successResponse = { isSuccess: true, request: { uri: { href: path } } };

describe( 'Backend service helpers', function(){

	beforeEach( function(){

		logger = spyLogger();
		sessionid = 'abc';
		req = {
			year,
			cookies: { sessionid }
		};
	} );

	describe( 'Normal mode', function(){

		let configStub;
		let backendRequest;
		let sessionGetData;

		function checkSessionGetArgs( path, req ){

			const args = backendRequest.sessionGet.calls.argsFor( 0 );

			expect( backendRequest.sessionGet ).toHaveBeenCalled();
			expect( args[ 0 ] ).toEqual( req.cookies.sessionid );
			expect( args[ 1 ] ).toEqual( path );
			expect( typeof args[ 2 ] ).toEqual( 'function' );
		}

		beforeEach( function(){

			configStub = { backend: { stub: false, fake: false, mock: false, timeout: backendTimeout } };
			sessionGetData = {};

			backendRequest = {
				get: jasmine.createSpy( 'backend-request.get' ).and.callFake( ( path, cb ) => cb( null, successResponse, {} ) ),
				post: jasmine.createSpy( 'backend-request.post' ).and.callFake( ( path, params, cb ) => cb( null, successResponse, {} ) ),
				sessionGet: jasmine.createSpy( 'backend-request.sessionGet' ).and.callFake( ( sessionId, path, cb ) => cb( null, successResponse, sessionGetData ) ),
				sessionPost: jasmine.createSpy( 'backend-request.sessionPost' ).and.callFake( ( sessionId, path, data, cb ) => cb( null, successResponse, {} ) )
			};

			reporter = {
				message: jasmine.createSpy( 'reporter.message' )
			};

			helpers = proxyquire( '../../../../../../app/lib/service/service.backend/_helpers', {
				'../../../config': configStub,
				'../../backend-request': backendRequest,
				'../../logger': logger,
				'../../reporter': reporter
			} );
		} );

		describe( 'get', function(){

			it( 'Should return a promise', function( done ){

				helpers.get( path ).then( () => {

					const args = backendRequest.get.calls.argsFor( 0 );

					expect( backendRequest.get ).toHaveBeenCalled();
					expect( args[ 0 ] ).toEqual( path );
					expect( typeof args[ 1 ] ).toEqual( 'function' );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'post', function(){

			it( 'Should return a promise', function( done ){

				const params = {
					code: 1,
					state: 2
				};

				helpers.post( path, params ).then( () => {

					const args = backendRequest.post.calls.argsFor( 0 );

					expect( backendRequest.post ).toHaveBeenCalled();
					expect( args[ 0 ] ).toEqual( path );
					expect( args[ 1 ] ).toEqual( params );
					expect( typeof args[ 2 ] ).toEqual( 'function' );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'sessionGet', function(){

			it( 'Should return a promise and pass the params to the backend', function( done ){

				helpers.sessionGet( path, req ).then( () => {

					checkSessionGetArgs( path, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'sessionPost', function(){

			it( 'Should return a promise and pass the params to the backend', function( done ){

				let data = { my: true, test: true };

				helpers.sessionPost( path, req, data ).then( () => {

					const args = backendRequest.sessionPost.calls.argsFor( 0 );

					expect( backendRequest.sessionPost ).toHaveBeenCalled();
					expect( args[ 0 ] ).toEqual( sessionid );
					expect( args[ 1 ] ).toEqual( path );
					expect( args[ 2 ] ).toEqual( data );
					expect( typeof args[ 3 ] ).toEqual( 'function' );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'getJson', function(){

			describe( 'When the path already has a query param', function(){

				it( 'Should add the year to the existing params', function( done ){

					const allPath = `${ path }?all=1`;

					helpers.getJson( allPath, req ).then( () => {

						checkSessionGetArgs( `${ allPath }&year=${ year }`, req );
						done();
					} );
				} );
			} );

			describe( 'Passing a date to the backend', function(){

				describe( 'When there is a date[start] in the req', function(){

					it( 'Should pass send the start_date param', function( done ){

						const startDate = '2017-06-16';

						req.dateRange = { start: startDate };

						helpers.getJson( path, req ).then( () => {

							checkSessionGetArgs( `${ path }?year=${ year }&date_start=${ startDate }`, req );
							done();

						} ).catch( done.fail );
					} );
				} );

				describe( 'When there is a date[end] in the req', function(){

					it( 'Should pass send the end_date param', function( done ){

						const endDate = '2017-06-16';

						req.dateRange = { end: endDate };

						helpers.getJson( path, req ).then( () => {

							checkSessionGetArgs( `${ path }?year=${ year }&date_end=${ endDate }`, req );
							done();

						} ).catch( done.fail );
					} );
				} );
			} );

			describe( 'When there is an error', function(){

				describe( 'When the backend is not available', function(){

					it( 'Should throw a custom error', function( done ){

						backendRequest.sessionGet.and.callFake( function( sessionId, path, cb ){

							const err = new Error();
							err.code = 'ECONNREFUSED';

							cb( err, { isSuccess: false, elapsedTime: 0 } );
						} );

						helpers.getJson( path, req ).then( done.fail ).catch( ( e ) => {

							expect( e ).toEqual( new Error( 'The backend is not available.' ) );
							done();
						} );
					} );
				} );

				describe( 'When there is another error', function(){

					it( 'Should throw the orginial error', function( done ){

						const err = new Error();
						err.code = 'SOME_ERROR';

						backendRequest.sessionGet.and.callFake( function( sessionId, path, cb ){

							cb( err, { isSuccess: false, elapsedTime: 0 } );
						} );

						helpers.getJson( path, req ).then( done.fail ).catch( ( e ) => {

							expect( e ).toEqual( err );
							done();
						} );
					} );
				} );
			} );

			describe( 'When the backend response is not a success code', function(){

				describe( 'When it is a 403', function(){

					it( 'Should set the correct message', function( done ){

						const response = {
							isSuccess: false,
							elapsedTime: 0,
							statusCode: 403,
							request: {
								uri: {
									href: '/mi/some/uri'
								}
							}
						};
						const data = { someData: true };

						backendRequest.sessionGet.and.callFake( function( sessionId, path, cb ){

							cb( null, response, data );
						} );

						helpers.getJson( path, req ).then( done.fail ).catch( ( e ) => {

							expect( e.message ).toEqual( 'Not logged in' );
							expect( e.response ).toEqual( response );
							expect( e.data ).toEqual( data );

							expect( logger.debug ).toHaveBeenCalled();
							done();
						} );
					} );
				} );

				describe( 'When it is not a 403', function(){

					it( 'Should set the statusCode and use the default message', function( done ){

						const response = {
							isSuccess: false,
							elapsedTime: 0,
							statusCode: 400,
							request: {
								uri: {
									href: '/mi/some/uri'
								}
							}
						};
						const data = { someData: true };

						backendRequest.sessionGet.and.callFake( function( sessionId, path, cb ){

							cb( null, response, data );
						} );

						helpers.getJson( path, req ).then( done.fail ).catch( ( e ) => {

							expect( e.message ).toEqual( `Got a ${ response.statusCode } status code for url: ${ response.request.uri.href }` );
							expect( e.response ).toEqual( response );
							expect( e.data ).toEqual( data );

							expect( logger.error ).toHaveBeenCalled();
							done();
						} );

					} );
				} );
			} );

			describe( 'With a transformer', function(){

				let transformerSpy;

				beforeEach( function(){

					transformerSpy = jasmine.createSpy( 'transformer' );
				} );

				describe( 'When the transformer calls successfully', function(){

					it( 'Should return the transformed results', function( done ){

						const transformedResponse = { transformed: true };
						transformerSpy.and.callFake( () => transformedResponse );
						sessionGetData.results = { success: true };

						helpers.getJson( path, req, transformerSpy ).then( ( data ) => {

							expect( transformerSpy ).toHaveBeenCalledWith( { success: true } );
							expect( data ).toEqual( { results: transformedResponse } );
							done();

						} ).catch( done.fail );
					} );
				} );

				describe( 'When the transformer throws an error', function(){

					it( 'Should throw an error', function( done ){

						transformerSpy.and.callFake( () => { throw new Error( 'test' ); } );
						sessionGetData.results = { success: true };

						helpers.getJson( path, req, transformerSpy ).then( done.fail ).catch( ( e ) => {

							expect( logger.error ).toHaveBeenCalled();
							expect( transformerSpy ).toHaveBeenCalledWith( { success: true } );
							expect( e ).toEqual( new Error( 'Unable to transform API response' ) );
							done();
						} );
					} );
				} );
			} );
		} );

		describe( 'getAll', function(){

			const formatterResponse = { data: true };
			const formatter = spy( 'formatter', formatterResponse );
			const promise1Data = { promise1: true };
			const promise2Data = { promise2: true };

			describe( 'With a success from the backend', function(){

				it( 'Should return the data via the formatter', function( done ){

					const promise1 = new Promise( ( resolve ) => resolve( promise1Data ) );
					const promise2 = new Promise( ( resolve ) => resolve( promise2Data ) );

					helpers.getAll( 'name', [ promise1, promise2 ], formatter ).then( ( data ) => {

						expect( formatter ).toHaveBeenCalledWith( [ promise1Data, promise2Data ] );
						expect( data ).toEqual( formatterResponse );
						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'When one of the APIs returns after a long time', function(){

				function checkReporterMessage( methodName ){

					const args = reporter.message.calls.argsFor( 0 );

					expect( reporter.message ).toHaveBeenCalled();
					expect( args[ 0 ] ).toEqual( 'info' );
					expect( args[ 1 ] ).toEqual( 'Long aggregate response time from ' + methodName );
					expect( args[ 2 ].time ).toBeDefined();
					expect( args[ 2 ].name ).toEqual( methodName );
				}

				it( 'Should report the delay and return the response', function( done ){

					const promise1 = new Promise( ( resolve ) => resolve( promise1Data ) );
					const promise2 = new Promise( ( resolve ) => {
						setTimeout( () => resolve( promise2Data ), backendTimeout + 2 );
					} );

					helpers.getAll( 'name', [ promise1, promise2 ], formatter ).then( ( data ) => {

						expect( formatter ).toHaveBeenCalledWith( [ promise1Data, promise2Data ] );
						expect( data ).toEqual( formatterResponse );
						checkReporterMessage( 'name' );
						done();

					} ).catch( done.fail );
				} );
			} );
		} );
	} );

	describe( 'Stubbed mode', function(){

		let stubbedBackendRequest;

		beforeEach( function(){

			stubbedBackendRequest = {
				get: jasmine.createSpy( 'backend-request.stub.get' ).and.callFake( ( path, cb ) => cb( null, successResponse, {} ) ),
				sessionGet: jasmine.createSpy( 'backend-request.stub.sessionGet' ).and.callFake( ( sessionId, path, cb ) => cb( null, successResponse, {} ) ),
				sessionPost: jasmine.createSpy( 'backend-request.stub.sessionPost' ).and.callFake( ( sessionId, path, data, cb ) => cb( null, successResponse, {} ) )
			};

			helpers = proxyquire( '../../../../../../app/lib/service/service.backend/_helpers', {
				'../../../config': { backend: { stub: true, fake: false, mock: false } },
				'../../backend-request.stub': stubbedBackendRequest
			} );
		} );

		describe( 'get', function(){

			it( 'Should call the stubbed backend-request', function( done ){

				helpers.get( path ).then ( () => {

					const args = stubbedBackendRequest.get.calls.argsFor( 0 );

					expect( stubbedBackendRequest.get ).toHaveBeenCalled();
					expect( args[ 0 ] ).toEqual( path );
					expect( typeof args[ 1 ] ).toEqual( 'function' );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'sessionGet', function(){

			it( 'Should call the stubbed backend-request', function( done ){

				helpers.sessionGet( path, req ).then( () => {

					const args = stubbedBackendRequest.sessionGet.calls.argsFor( 0 );

					expect( stubbedBackendRequest.sessionGet ).toHaveBeenCalled();
					expect( args[ 0 ] ).toEqual( sessionid );
					expect( args[ 1 ] ).toEqual( path );
					expect( typeof args[ 2 ] ).toEqual( 'function' );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'sessionPost', function(){

			it( 'Should call the stubbed backend-request', function( done ){

				let data = { my: true, test: true };

				helpers.sessionPost( path, req, data ).then( () => {

					const args = stubbedBackendRequest.sessionPost.calls.argsFor( 0 );

					expect( stubbedBackendRequest.sessionPost ).toHaveBeenCalled();
					expect( args[ 0 ] ).toEqual( sessionid );
					expect( args[ 1 ] ).toEqual( path );
					expect( args[ 2 ] ).toEqual( data );
					expect( typeof args[ 3 ] ).toEqual( 'function' );
					done();

				} ).catch( done.fail );
			} );
		} );
	} );
} );
