const proxyquire = require( 'proxyquire' );
const backendService = require( '../../../../app/lib/service/service.backend' );
const errorHandler = require( '../../../../app/lib/render-error' );

const interceptBackend = require( '../../helpers/intercept-backend' );
const createErrorHandler = require( '../../helpers/create-error-handler' );

const year = 2017;
let controller;

describe( 'Overseas Regions controller', function(){

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

		controller = proxyquire( '../../../../app/controllers/controller.index', stubs );
	} );

	describe( 'Handler', function(){

		it( 'Should get the sectors list data and render the view', function( done ){

			const req = {
				alice: '87654',
				year,
				query: {}
			};

			spyOn( backendService, 'getSectorTeams' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callFake( createErrorHandler( done ) );

			interceptBackend.getStub( `/mi/sector_teams/?year=${ year }`, 200, '/sector_teams/' );

			controller( req, { render: function( view, data ){

				expect( backendService.getSectorTeams ).toHaveBeenCalledWith( req.alice, req.year );
				expect( view ).toEqual( 'index.html' );
				expect( data.sectorTeams ).toBeDefined();
				expect( data.sectorTeams.length ).toBeGreaterThan( 1 );
				expect( data.overseasRegions ).not.toBeDefined();
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} } );
		} );
	} );

	describe( 'When the os-regions query param is true', function(){

		it( 'Should show the Overseas Regions list and render the view', function( done ){

			const req = {
				alice: '87654',
				year,
				query: {
					osRegions: true
				}
			};

			spyOn( backendService, 'getSectorTeamsAndOverseasRegions' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callFake( createErrorHandler( done ) );

			interceptBackend.getStub( `/mi/sector_teams/?year=${ year }`, 200, '/sector_teams/' );
			interceptBackend.getStub( `/mi/os_regions/?year=${ year }`, 200, '/os_regions/' );

			controller( req, { render: function( view, data ){

				expect( backendService.getSectorTeamsAndOverseasRegions ).toHaveBeenCalledWith( req.alice, req.year );
				expect( view ).toEqual( 'index.html' );
				expect( data.sectorTeams ).toBeDefined();
				expect( data.sectorTeams.length ).toBeGreaterThan( 1 );
				expect( data.overseasRegionGroups ).toBeDefined();
				expect( data.overseasRegionGroups.length ).toBeGreaterThan( 1 );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} } );
		} );
	} );
} );
