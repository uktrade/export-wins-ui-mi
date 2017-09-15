const proxyquire = require( 'proxyquire' );

const getBackendStub = require( '../../../../helpers/get-backend-stub' );
const interceptBackend = require( '../../../../helpers/intercept-backend' );
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

		function checkBackendArgs( path, req ){

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

		describe( 'sessionGet', function(){

			it( 'Should return a promise and pass the params to the backend', function( done ){

				helpers.sessionGet( path, req ).then( () => {

					checkBackendArgs( path, req );
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

			describe( 'Passing a date to the backend', function(){

				describe( 'When there is a date[start] in the req', function(){

					it( 'Should pass send the start_date param', function( done ){

						const startDate = '2017-06-16';

						req.dateRange = { start: startDate };

						helpers.getJson( path, req ).then( () => {

							checkBackendArgs( `${ path }?year=${ year }&date_start=${ startDate }`, req );
							done();

						} ).catch( done.fail );
					} );
				} );

				describe( 'When there is a date[end] in the req', function(){

					it( 'Should pass send the end_date param', function( done ){

						const endDate = '2017-06-16';

						req.dateRange = { end: endDate };

						helpers.getJson( path, req ).then( () => {

							checkBackendArgs( `${ path }?year=${ year }&date_end=${ endDate }`, req );
							done();

						} ).catch( done.fail );
					} );
				} );
			} );

			describe( 'When the backend is not available', function(){

				it( 'Should throw an error', function( done ){

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
				sessionGet: jasmine.createSpy( 'backend-request.stub.sessionGet' ).and.callFake( ( sessionId, path, cb ) => cb( null, successResponse, {} ) ),
				sessionPost: jasmine.createSpy( 'backend-request.stub.sessionPost' ).and.callFake( ( sessionId, path, data, cb ) => cb( null, successResponse, {} ) )
			};

			helpers = proxyquire( '../../../../../../app/lib/service/service.backend/_helpers', {
				'../../../config': { backend: { stub: true, fake: false, mock: false } },
				'../../backend-request.stub': stubbedBackendRequest
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
