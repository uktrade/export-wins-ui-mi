const proxyquire = require( 'proxyquire' );

const exportBackendService = {};
const errorHandler = {};

let sortWins;
let sortWinsResponse;

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

		sortWinsResponse = { some: 'wins' };

		errorHandler.createHandler = jasmine.createSpy( 'createHandler' );
		sortWins = spy( 'sortWins', sortWinsResponse );

		controller = proxyquire( '../../../../app/controllers/controller.hvc-groups', {
			'../lib/service/service.backend': { export: exportBackendService },
			'../lib/render-error': errorHandler,
			'../lib/sort-wins': sortWins,
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

			exportBackendService.getHvcGroups = spy( 'getHvcGroups', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.list( req, res );

			promise.then( () => {

				expect( exportBackendService.getHvcGroups ).toHaveBeenCalledWith( req );
				expect( res.render ).toHaveBeenCalledWith( 'hvc-groups/list.html', {
					hvcGroups: hvcGroups.results
				} );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
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

			exportBackendService.getHvcGroupInfo = spy( 'getHvcGroupInfo', promise );
			sectorSummary.create = spy( 'sectorSummary.create', sectorSummaryResponse );
			hvcSummary.create = spy( 'hvcSummary.create', hvcSummaryResponse );
			hvcTargetPerformance.create = spy( 'hvcTargetPerformance.create', hvcTargetPerformanceResponse );
			monthlyPerformance.create = spy( 'monthlyPerformance.create', monthlyPerformanceResponse );

			controller.group( req, res );

			promise.then( () => {

				expect( exportBackendService.getHvcGroupInfo ).toHaveBeenCalledWith( req, groupId );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
				expect( sectorSummary.create ).toHaveBeenCalledWith( wins );
				expect( hvcSummary.create ).toHaveBeenCalledWith( wins );
				expect( hvcTargetPerformance.create ).toHaveBeenCalledWith( campaigns );
				expect( monthlyPerformance.create ).toHaveBeenCalledWith( months );

				expect( res.render ).toHaveBeenCalledWith( 'hvc-groups/detail.html', {
					groupId,
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

	describe( 'Wins', function(){

		it( 'Should get the list of wins and render the correct view', function( done ){

			const groupId = 123;
			const sort = { some: 'sort', params: true };

			const req = {
				cookies: { sessionid: '123' },
				params: {
					id: groupId
				},
				year,
				query: { sort }
			};

			const res = {
				render: jasmine.createSpy( 'res.render' )
			};

			const hvcGroupWins = {
				date_range: { start: 1, end: 2 },
				results: {
					hvc_group: { group: true },
					wins: { hvc: { hvcGroupWins: true }, non_hvc: { nonHvcGroupWins: true } }
				}
			};

			const promise = new Promise( ( resolve ) => {

				resolve( hvcGroupWins );
			} );

			exportBackendService.getHvcGroupWinTable = spy( 'getHvcGroupWinTable', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.wins( req, res );

			promise.then( () => {

				expect( exportBackendService.getHvcGroupWinTable ).toHaveBeenCalledWith( req, groupId );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
				expect( sortWins ).toHaveBeenCalledWith( hvcGroupWins.results.wins.hvc, sort );
				expect( res.render ).toHaveBeenCalledWith( 'hvc-groups/wins.html', {
					dateRange: hvcGroupWins.date_range,
					hvcGroup: hvcGroupWins.results.hvc_group,
					wins: sortWinsResponse
				} );
				done();
			} );
		} );
	} );
} );
