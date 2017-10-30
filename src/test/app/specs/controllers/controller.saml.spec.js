const proxyquire = require( 'proxyquire' );
const errorHandler = require( '../../../../app/lib/render-error' );
const logger = require( '../../helpers/mock-logger' );

let backendService;
let controller;
let reporter;

describe( 'SAML controller', function(){

	let oldTimeout;

	afterEach( function(){

		jasmine.DEFAULT_TIMEOUT_INTERVAL = oldTimeout;
	} );

	beforeEach( function(){

		oldTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

		reporter = {
			captureException: jasmine.createSpy( 'reporter.captureException' ),
			message: jasmine.createSpy( 'reported.message' )
		};

		backendService = proxyquire( '../../../../app/lib/service/service.backend', {
			'../logger': logger
		} );

		controller = proxyquire( '../../../../app/controllers/controller.saml', {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../lib/reporter': reporter
		} );

		spyOn( errorHandler, 'createHandler' ).and.callFake( () => {} );
	} );

	describe( 'acs', function(){

		describe( 'When the post data is XML', function(){

			let req;
			let res;

			beforeEach( function(){

				req = { cookies: { sessionid: 'abc123' }, data: '<xml>' };
				res = {
					set: jasmine.createSpy( 'res.set' ),
					redirect: jasmine.createSpy( 'res.redirect' ),
					render: jasmine.createSpy( 'res.render' )
				};
			} );

			describe( 'When the backend response is success', function(){

				it( 'Should send the post data to the backend and set a cookie', function( done ){

					const setCookieResponse = 'sessionid=abc1234';
					const promise = new Promise( ( resolve ) => {

						resolve( {
							response: {
								headers: {
									'set-cookie': [ setCookieResponse, 'other-cookie=test' ]
								}
							}
						} );

					} );

					spyOn( errorHandler, 'sendResponse' ).and.callFake( () => {} );
					spyOn( backendService, 'sendSamlXml' ).and.callFake( () => promise );

					controller.acs( req, res );

					promise.then( () => {

						expect( backendService.sendSamlXml ).toHaveBeenCalledWith( req );
						expect( errorHandler.createHandler ).not.toHaveBeenCalled();
						expect( errorHandler.sendResponse ).not.toHaveBeenCalled();
						expect( res.set ).toHaveBeenCalledWith( 'Set-Cookie', [ setCookieResponse ] );
						expect( res.redirect ).toHaveBeenCalledWith( '/' );
						done();
					} );
				} );
			} );

			describe( 'When the backend response is not a success', function(){

				describe( 'When the response is a 403', function(){

					it( 'Should render an MI group error page and log to sentry', function( done ){

						const promise = new Promise( ( resolve, reject ) => {

							const err = new Error( 'not in MI group' );
							err.code = 403;

							reject( err );

							process.nextTick( () => {

								expect( errorHandler.createHandler ).not.toHaveBeenCalled();
								expect( errorHandler.sendResponse ).not.toHaveBeenCalled();
								expect( res.render ).toHaveBeenCalledWith( 'error/not-mi.html' );
								expect( reporter.message ).toHaveBeenCalledWith( 'info', 'User not in MI group' );

								done();
							} );
						} );

						spyOn( errorHandler, 'sendResponse' ).and.callFake( () => {} );
						spyOn( backendService, 'sendSamlXml' ).and.callFake( () => promise );

						controller.acs( req, res );
					} );
				} );

				describe( 'When the response is a 500', function(){

					it( 'Should render an unable to login error page and send the error to sentry', function( done ){

						const promise = new Promise( ( resolve, reject ) => {

							const err = new Error( 'server error' );
							err.code = 500;

							reject( err );

							process.nextTick( () => {

								expect( errorHandler.createHandler ).not.toHaveBeenCalled();
								expect( errorHandler.sendResponse ).not.toHaveBeenCalled();
								expect( res.render ).toHaveBeenCalledWith( 'error/unable-to-login.html' );
								expect( reporter.captureException ).toHaveBeenCalledWith( err );

								done();
							} );
						} );

						spyOn( errorHandler, 'sendResponse' ).and.callFake( () => {} );
						spyOn( backendService, 'sendSamlXml' ).and.callFake( () => promise );

						controller.acs( req, res );
					} );
				} );

				describe( 'When the response is not a 403', function(){

					it( 'Should render the generic error page', function( done ){

						const promise = new Promise( ( resolve, reject ) => {

							const err = new Error( 'not found' );
							err.code = 404;

							reject( err );

							process.nextTick( () => {

								expect( errorHandler.createHandler ).not.toHaveBeenCalled();
								expect( errorHandler.sendResponse ).toHaveBeenCalledWith( res, err );
								expect( reporter.captureException ).toHaveBeenCalledWith( err );
								done();
							} );
						} );

						spyOn( backendService, 'sendSamlXml' ).and.callFake( () => promise );
						spyOn( errorHandler, 'sendResponse' ).and.callFake( () => {} );

						controller.acs( req, res );
					} );
				} );
			} );
		} );
	} );

	describe( 'metadata', function(){

		it( 'Should get the metadata and return it', function( done ){

			const xml = '<xml test=true"/>';
			const req = { cookies: {} };
			const res = {
				set: jasmine.createSpy( 'res.set' ),
				send: jasmine.createSpy( 'res.send' )
			};

			const promise = new Promise( ( resolve ) => {

				resolve( xml );
			} );

			spyOn( backendService, 'getSamlMetadata' ).and.callFake( () => promise );

			controller.metadata( req, res );

			promise.then( () => {

				expect( backendService.getSamlMetadata ).toHaveBeenCalledWith( req );
				expect( res.set ).toHaveBeenCalledWith( 'Content-Type', 'text/xml' );
				expect( res.send ).toHaveBeenCalledWith( xml );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
				done();
			} );
		} );
	} );
} );
