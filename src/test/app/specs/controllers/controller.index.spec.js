const proxyquire = require( 'proxyquire' );

const errorHandler = {};
const backendService = {};
const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

let controller;
let globalSummary;
let globalSummaryData;

describe( 'Index controller', function(){

	beforeEach( function(){

		globalSummaryData = { globalSummaryData: true };
		errorHandler.createHandler = jasmine.createSpy( 'createHandler' );
		globalSummary = { create: spy( 'globalSummary.create', globalSummaryData ) };

		controller = proxyquire( '../../../../app/controllers/controller.index', {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../lib/view-models/global-summary': globalSummary
		} );
	} );

	describe( 'Handler', function(){

		it( 'Should render the view with the corect data', function( done ){

			const req = {
				cookies: { sessionid: '456' },
				year: 2017
			};

			const res = {
				render: jasmine.createSpy( 'res.render' )
			};

			const sectorTeams = { results: { sectorTeams: true } };
			const overseasRegionGroups = { results: { overseasRegionGroups: true } };
			const globalHvcs = { results: { globalHvcs: true } };
			const globalWins = { date_range: { test: 1 }, results: { globalWins: true } };

			const promise = new Promise( ( resolve ) => {

				resolve( {
					sectorTeams,
					overseasRegionGroups,
					globalHvcs,
					globalWins
				} );
			} );

			backendService.getHomepageData = spy( 'getHomepageData', promise );

			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller( req, res );

			promise.then( () => {

				expect( backendService.getHomepageData ).toHaveBeenCalledWith( req );
				expect( globalSummary.create ).toHaveBeenCalledWith( globalWins );
				expect( res.render ).toHaveBeenCalledWith( 'index.html', {
					sectorTeams: sectorTeams.results,
					overseasRegionGroups: overseasRegionGroups.results,
					globalHvcs: globalHvcs.results,
					summary: globalSummaryData
				} );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} );
		} );
	} );
} );
