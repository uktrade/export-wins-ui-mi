const proxyquire = require( 'proxyquire' );
const errorHandler = require( '../../../../app/lib/render-error' );
const interceptBackend = require( '../../helpers/intercept-backend' );
const logger = require( '../../helpers/mock-logger' );

let backendService;
let controller;
let config;

describe( 'SAML controller', function(){

	let oldTimeout;

	beforeEach( function(){

		oldTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
	} );

	afterEach( function(){

		jasmine.DEFAULT_TIMEOUT_INTERVAL = oldTimeout;
	} );

	beforeEach( function(){

		config = {};

		backendService = proxyquire( '../../../../app/lib/service/service.backend', {
			'../logger': logger
		} );

		controller = proxyquire( '../../../../app/controllers/controller.saml', {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../config': config
		} );
	} );

	describe( 'acs', function(){

		describe( 'When the post data is XML', function(){

			let req;

			beforeEach( function(){

				req = { cookies: { sessionid: 'abc123' }, data: '<xml>' };

				spyOn( backendService, 'sendSamlXml' ).and.callThrough();
				spyOn( errorHandler, 'createHandler' ).and.callFake( () => {} );
			} );

			describe( 'When the backend response is success', function(){

				it( 'Should send the post data to the backend and set a cookie', function( done ){

					spyOn( errorHandler, 'sendResponse' ).and.callFake( () => {} );

					const response = 'success';
					const setCookieResponse = 'sessionid=abc1234';

					const res = {
						set: jasmine.createSpy( 'res.set' ),
						redirect: function( location ){

							expect( backendService.sendSamlXml ).toHaveBeenCalledWith( req );
							expect( errorHandler.createHandler ).not.toHaveBeenCalled();
							expect( errorHandler.sendResponse ).not.toHaveBeenCalled();
							expect( res.set ).toHaveBeenCalledWith( 'Set-Cookie', setCookieResponse );
							expect( location ).toEqual( '/' );
							done();
						}
					};

					interceptBackend.post( '/saml2/acs/' ).reply( 200, response, {
						'Set-Cookie': setCookieResponse
					} );

					controller.acs( req, res );
				} );
			} );

			describe( 'When the backend response is not a success', function(){

				describe( 'When the response is a 403', function(){

					it( 'Should render an MI group error page', function( done ){

						spyOn( errorHandler, 'sendResponse' ).and.callFake( () => {} );

						interceptBackend.post( '/saml2/acs/' ).reply( 403, '{ "code": 1, "message": "not in MI group" }', {
							'Content-Type': 'application/json'
						} );

						controller.acs( req, {
							render: function( view ){

								expect( errorHandler.createHandler ).not.toHaveBeenCalled();
								expect( errorHandler.sendResponse ).not.toHaveBeenCalled();

								expect( view ).toEqual( 'error-not-mi.html' );
								done();
							}
						} );
					} );
				} );

				describe( 'When the response is not a 403', function(){

					it( 'Should render the generic error page', function( done ){

						spyOn( errorHandler, 'sendResponse' ).and.callFake( ( e ) => {

							expect( errorHandler.createHandler ).not.toHaveBeenCalled();
							expect( e ).toBeDefined();
							done();
						} );

						interceptBackend.post( '/saml2/acs/' ).reply( 500, '' );

						controller.acs( req, {} );
					} );
				} );
			} );

		} );
	} );

	describe( 'metadata', function(){

		it( 'Should get the metadata and return it', function( done ){

			spyOn( backendService, 'getSamlMetadata' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callFake( () => done.fail );

			const xml = '<xml test=true"/>';
			const req = { cookies: {} };
			const res = {

				set: jasmine.createSpy( 'res.set' ),

				send: function( data ){

					expect( backendService.getSamlMetadata ).toHaveBeenCalledWith( req );
					expect( res.set ).toHaveBeenCalledWith( 'Content-Type', 'text/xml' );
					expect( data ).toEqual( xml );
					expect( errorHandler.createHandler ).toHaveBeenCalled();
					done();
				}
			};

			interceptBackend.get( '/saml2/metadata/' ).reply( 200, xml );

			controller.metadata( req, res );
		} );
	} );
} );
