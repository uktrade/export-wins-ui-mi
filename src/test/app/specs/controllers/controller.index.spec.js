const proxyquire = require( 'proxyquire' );

const errorHandler = {};
const backendService = {};
const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

let controller;

describe( 'Index controller', function(){

	beforeEach( function(){

		errorHandler.createHandler = jasmine.createSpy( 'createHandler' );

		controller = proxyquire( '../../../../app/controllers/controller.index', {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler
		} );
	} );

	describe( 'Handler', function(){

		it( 'Should show the Overseas Regions list and render the view', function( done ){

			const req = {
				cookies: { sessionid: '456' },
				year: 2017
			};

			const res = {
				render: jasmine.createSpy( 'res.render' )
			};

			const sectorTeams = {
				results: { sectorTeams: true }
			};
			const overseasRegionGroups = {
				results: { overseasRegionGroups: true }
			};

			const promise = new Promise( ( resolve ) => {

				resolve( {
					sectorTeams,
					overseasRegionGroups
				} );
			} );

			backendService.getSectorTeamsAndOverseasRegions = spy( 'getSectorTeamsAndOverseasRegions', promise );

			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller( req, res );

			promise.then( () => {

				expect( backendService.getSectorTeamsAndOverseasRegions ).toHaveBeenCalledWith( req );
				expect( res.render ).toHaveBeenCalledWith( 'index.html', {
					sectorTeams: sectorTeams.results,
					overseasRegionGroups: overseasRegionGroups.results
				} );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} );
		} );
	} );
} );
