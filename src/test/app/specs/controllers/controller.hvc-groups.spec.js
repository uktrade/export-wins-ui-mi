const proxyquire = require( 'proxyquire' );

const backendService = {};
const errorHandler = {};
const sectorSummary = {};
const hvcSummary = {};
const hvcTargetPerformance = {};
const monthlyPerformance = {};

const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

const year = 2017;
let controller;

describe( 'HVC Groups controller', function(){

	beforeEach( function(){

		errorHandler.createHandler = jasmine.createSpy( 'createHandler' );

		controller = proxyquire( '../../../../app/controllers/controller.hvc-groups', {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../lib/view-models/sector-summary': sectorSummary,
			'../lib/view-models/sector-hvc-summary': hvcSummary,
			'../lib/view-models/hvc-target-performance': hvcTargetPerformance,
			'../lib/view-models/monthly-performance': monthlyPerformance
		} );
	} );

	describe( 'List', function(){

		it( 'Should get the list data and render the correct view', function( done ){

			const req = {
				cookies: { sessionid: '123' },
				year
			};

			const res = {
				render: jasmine.createSpy( 'res.render' )
			};

			const hvcGroups = {
				results: { hvcGroups: true }
			};

			const promise = new Promise( ( resolve ) => {

				resolve( hvcGroups );
			} );

			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );
			backendService.getHvcGroups = jasmine.createSpy( 'getHvcGroups' );
			backendService.getHvcGroups.and.callFake( () => promise );

			controller.list( req, res );

			promise.then( () => {

				expect( backendService.getHvcGroups ).toHaveBeenCalledWith( req );
				expect( res.render ).toHaveBeenCalledWith( 'hvc-groups/list.html', {
					hvcGroups: hvcGroups.results
				} );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} );
		} );
	} );

	describe( 'Group', function(){

		it( 'Should get the group data and render the correct view', function( done ){

			const req = {
				cookies: { sessionid: '456' },
				year,
				params: {
					id: 1234
				}
			};

			const res = {
				render: jasmine.createSpy( 'res.render' )
			};

			const groupId = req.params.id;

			const wins = { results: { name: 'test hvc-groups' } };
			const months = { results: { months: true } };
			const campaigns = { results: { campaigns: true } };

			const sectorSummaryResponse = { sectorSummary: true };
			const hvcSummaryResponse = { hvcSummaryResponse: true };
			const hvcTargetPerformanceResponse = { hvcTargetPerformance: true };
			const monthlyPerformanceResponse = { monthlyPerformance: true };

			const promise = new Promise( ( resolve ) => {

				resolve( { wins, months, campaigns } );
			} );

			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			backendService.getHvcGroupInfo = spy( 'getHvcGroupInfo', promise );
			sectorSummary.create = spy( 'sectorSummary.create', sectorSummaryResponse );
			hvcSummary.create = spy( 'hvcSummary.create', hvcSummaryResponse );
			hvcTargetPerformance.create = spy( 'hvcTargetPerformance.create', hvcTargetPerformanceResponse );
			monthlyPerformance.create = spy( 'monthlyPerformance.create', monthlyPerformanceResponse );

			controller.group( req, res );

			promise.then( () => {

				expect( backendService.getHvcGroupInfo ).toHaveBeenCalledWith( req, groupId );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( sectorSummary.create ).toHaveBeenCalledWith( wins );
				expect( hvcSummary.create ).toHaveBeenCalledWith( wins );
				expect( hvcTargetPerformance.create ).toHaveBeenCalledWith( campaigns );
				expect( monthlyPerformance.create ).toHaveBeenCalledWith( months );

				expect( res.render ).toHaveBeenCalledWith( 'hvc-groups/detail.html', {

					sectorName: wins.results.name,
					summary: sectorSummaryResponse,
					hvcSummary: hvcSummaryResponse,
					monthlyPerformance: monthlyPerformanceResponse,
					hvcTargetPerformance: hvcTargetPerformanceResponse
				} );
				done();
			} );
		} );
	} );
} );
