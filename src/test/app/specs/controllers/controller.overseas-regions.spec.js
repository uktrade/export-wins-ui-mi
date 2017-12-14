const proxyquire = require( 'proxyquire' );

const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

const year = 2017;

let exportBackendService;
let errorHandler;
let sortWins;
let sortWinsResponse;

let sectorSummary;
let hvcSummary;
let hvcTargetPerformance;
let topMarkets;
let monthlyPerformance;

let res;
let controller;


describe( 'Overseas Regions controller', function(){

	beforeEach( function(){

		sortWinsResponse = { some: 'wins' };

		exportBackendService = {};
		errorHandler = { createHandler: spy( 'errorHandler.createHandler' ) };
		sortWins = spy( 'sortWins', sortWinsResponse );

		sectorSummary = {};
		hvcSummary = {};
		hvcTargetPerformance = {};
		topMarkets = {};
		monthlyPerformance = {};

		res = {
			render: spy( 'res.render' )
		};

		controller = proxyquire( '../../../../app/controllers/controller.overseas-regions', {
			'../lib/service/service.backend': { export: exportBackendService },
			'../lib/render-error': errorHandler,
			'../lib/sort-wins': sortWins,
			'../lib/view-models/sector-summary': sectorSummary,
			'../lib/view-models/sector-hvc-summary': hvcSummary,
			'../lib/view-models/hvc-target-performance': hvcTargetPerformance,
			'../lib/view-models/top-markets': topMarkets,
			'../lib/view-models/monthly-performance': monthlyPerformance
		} );
	} );

	describe( 'Overview', function(){

		it( 'Should get the overview groups data and render the correct view', function( done ){

			const req = {
				cookies: { sessionid: '123' },
				year
			};

			const regionGroups = {
				date_range: { test: '1' },
				results: [ 'testing' ]
			};

			const promise = new Promise( ( resolve ) => {

				resolve( regionGroups );
			} );

			exportBackendService.getOverseasRegionsOverviewGroups = spy( 'getOverseasRegionsOverviewGroups', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.overview( req, res );

			promise.then( () => {

				expect( exportBackendService.getOverseasRegionsOverviewGroups ).toHaveBeenCalledWith( req );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
				expect( res.render ).toHaveBeenCalledWith( 'overseas-regions/overview.html', {
					dateRange: regionGroups.date_range,
					regionGroups: regionGroups.results
				} );
				done();
			} );
		} );
	} );

	describe( 'List', function(){

		it( 'Should get the list data and render the correct view', function( done ){

			const req = {
				cookies: { sessionid: '456' },
				year
			};

			const regions = { results: { 'regions': true } };

			const promise = new Promise( ( resolve ) => {	resolve( regions ); } );

			exportBackendService.getOverseasRegions = spy( 'getOverseasRegions', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.list( req, res );

			promise.then( () => {

				expect( exportBackendService.getOverseasRegions ).toHaveBeenCalledWith( req );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
				expect( res.render ).toHaveBeenCalledWith( 'overseas-regions/list.html', { regions: regions.results } );
				done();
			} );
		} );
	} );

	describe( 'Top non HVCs', function(){

		it( 'Should get the list data and render the correct view', function( done ){

			const req = {
				cookies: { sessionid: '456' },
				year,
				params: {
					id: 1234
				}
			};

			const topNonHvcs = { results: { 'topNonHvcs': true } };

			const promise = new Promise( ( resolve ) => {	resolve( topNonHvcs ); } );

			exportBackendService.getOverseasRegionTopNonHvc = spy( 'getOverseasRegionTopNonHvc', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.topNonHvcs( req, res );

			promise.then( () => {

				expect( exportBackendService.getOverseasRegionTopNonHvc ).toHaveBeenCalledWith( req, req.params.id, true );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
				expect( res.render ).toHaveBeenCalledWith( 'partials/top-non-hvcs.html', {
					topNonHvcs: topNonHvcs.results
				} );
				done();
			} );
		} );
	} );

	describe( 'Region', function(){

		it( 'Should get the region data and render the correct view', function( done ){

			const req = {
				cookies: { sessionid: '789' },
				year,
				params: {
					id: 1234
				}
			};

			const regionId = req.params.id;

			const sectorSummaryResponse = { 'sectorSummaryResponse': true };
			const hvcSummaryResponse = { 'hvcSummaryResponse': true };
			const hvcTargetPerformanceResponse = { 'hvcTargetPerformanceResponse': true };
			const topMarketsResponse = { 'topMarketsResponse': true };
			const monthlyPerformanceResponse = { 'monthlyPerformanceResponse': true };

			const data = {
				wins: { results: { name: 'test-regions' } },
				campaigns: [ 'test-campaigns' ],
				months: [ 'test-months' ],
				topNonHvc: { top: { non: 'hvc' } }
			};

			const promise = new Promise( ( resolve ) => { resolve( data ); } );

			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );
			exportBackendService.getOverseasRegionInfo = spy( 'getOverseasRegionInfo', promise );

			sectorSummary.create = spy( 'sectorSummary.create', sectorSummaryResponse );
			hvcSummary.create = spy( 'hvcSummary.create', hvcSummaryResponse );
			hvcTargetPerformance.create = spy( 'hvcTargetPerformance.create', hvcTargetPerformanceResponse );
			topMarkets.create = spy( 'topMarkets.create', topMarketsResponse );
			monthlyPerformance.create = spy( 'monthlyPerformance.create', monthlyPerformanceResponse );

			controller.region( req, res );

			promise.then( () => {

				expect( exportBackendService.getOverseasRegionInfo ).toHaveBeenCalledWith( req, regionId );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );

				expect( sectorSummary.create ).toHaveBeenCalledWith( data.wins );
				expect( hvcSummary.create ).toHaveBeenCalledWith( data.wins );
				expect( hvcTargetPerformance.create ).toHaveBeenCalledWith( data.campaigns );
				expect( monthlyPerformance.create ).toHaveBeenCalledWith( data.months );
				expect( topMarkets.create ).toHaveBeenCalledWith( data.topNonHvc );

				expect( res.render ).toHaveBeenCalledWith( 'overseas-regions/detail.html', {
					regionId,
					regionName: data.wins.results.name,
					summary: sectorSummaryResponse,
					hvcSummary: hvcSummaryResponse,
					hvcTargetPerformance: hvcTargetPerformanceResponse,
					monthlyPerformance: monthlyPerformanceResponse,
					topMarkets: topMarketsResponse
				} );
				done();
			} );
		} );
	} );

	describe( 'Win Lists', function(){

		function checkWins( methodName, type, view ){

			it( 'Should get the list of wins and render the correct view', function( done ){

				const regionId = 890;
				const sort = { some: 'sort', params: true };

				const req = {
					cookies: { sessionid: '456' },
					params: {
						id: regionId
					},
					year,
					query: { sort }
				};

				const regionWins = {
					date_range: { start: 6, end: 9 },
					results: {
						os_region: { test: 1 },
						wins: {
							hvc: [ 'some HVC wins' ],
							non_hvc: [ 'some non HVC wins' ]
						}
					}
				};

				const promise = new Promise( ( resolve ) => { resolve( regionWins ); } );

				exportBackendService.getOverseasRegionWinTable = spy( 'getOverseasRegionWinTable', promise );
				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

				controller[ methodName ]( req, res );

				promise.then( () => {

					expect( exportBackendService.getOverseasRegionWinTable ).toHaveBeenCalledWith( req, regionId );
					expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
					expect( sortWins ).toHaveBeenCalledWith( regionWins.results.wins[ type ], sort );
					expect( res.render ).toHaveBeenCalledWith( view, {
						dateRange: regionWins.date_range,
						region: regionWins.results.os_region,
						wins: sortWinsResponse
					} );
					done();
				} );
			} );
		}

		checkWins( 'wins', 'hvc', 'overseas-regions/wins.html' );
		checkWins( 'nonHvcWins', 'non_hvc', 'overseas-regions/non-hvc-wins.html' );
	} );
} );
