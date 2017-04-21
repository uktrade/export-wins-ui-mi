const proxyquire = require( 'proxyquire' );
const backendService = require( '../../../../app/lib/service/service.backend' );
const errorHandler = require( '../../../../app/lib/render-error' );
const interceptBackend = require( '../../helpers/intercept-backend' );

let controller;

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

		const stubs = {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler
		};

		controller = proxyquire( '../../../../app/controllers/controller.saml', stubs );
	} );

	xdescribe( 'acs', function(){

		describe( 'When the post data is XML', function(){

			describe( 'When the backend response is success', function(){

				it( 'Should send the post data to the backend and set a cookie', function( done ){

					spyOn( backendService, 'sendSamlXml' ).and.callThrough();
					spyOn( errorHandler, 'createHandler' ).and.callFake( () => done.fail );

					const response = 'success';

					const req = {
						data: '<xml>'
					};

					const res = {
						redirect: function( location ){

							expect( backendService.sendSamlXml ).toHaveBeenCalledWith( req.data );
							expect( location ).toEqual( '/' );
						}
					};

					interceptBackend.post( '/saml2/acs/' ).reply( 200, response );

					controller.acs( req, res );
				} );
			} );
		} );
	} );

	describe( 'metadata', function(){

		it( 'Should get the metadata and return it', function( done ){

			spyOn( backendService, 'getSamlMetadata' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callFake( () => done.fail );

			const xml = '<xml test=true"/>';
			const req = {};
			const res = {

				set: jasmine.createSpy( 'res.set' ),

				send: function( data ){

					expect( backendService.getSamlMetadata ).toHaveBeenCalled();
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
