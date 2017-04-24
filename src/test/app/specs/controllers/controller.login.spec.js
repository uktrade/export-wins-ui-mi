const proxyquire = require( 'proxyquire' );
const backendService = require( '../../../../app/lib/service/service.backend' );
const errorHandler = require( '../../../../app/lib/render-error' );
const interceptBackend = require( '../../helpers/intercept-backend' );

let controller;

describe( 'Login controller', function(){

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

		controller = proxyquire( '../../../../app/controllers/controller.login', stubs );
	} );

	describe( 'Login', function(){

		it( 'Should get the sectors list data and render the view', function( done ){

			const responseBody = 'test response';

			spyOn( backendService, 'getSamlLogin' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callFake( () => done );

			interceptBackend.get( '/saml2/login/' ).reply( 200, responseBody );

			controller( {}, { render: function( view, data ){

				expect( backendService.getSectorTeams ).toHaveBeenCalled();
				expect( view ).toEqual( 'login.html' );
				expect( data.token ).toEqual( responseBody );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} } );
		} );
	} );
} );
