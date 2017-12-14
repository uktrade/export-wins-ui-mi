const proxyquire = require( 'proxyquire' );

const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

const year = 2017;

let exportBackendService;
let errorHandler;
let sortWins;
let sortWinsResponse;

let res;
let controller;

let regionSummary;
let regionPerformance;
let topMarkets;
let monthlyPerformance;
let overviewSummary;
let overviewRegions;

describe( 'UK Regions controller', function(){

	beforeEach( function(){

		sortWinsResponse = { some: 'wins' };

		exportBackendService = {};
		errorHandler = { createHandler: spy( 'errorHandler.createHandler' ) };
		sortWins = spy( 'sortWins', sortWinsResponse );

		regionSummary = {};
		regionPerformance = {};
		topMarkets = {};
		monthlyPerformance = {};
		overviewSummary = {};
		overviewRegions = {};

		res = {
			render: spy( 'res.render' )
		};

		controller = proxyquire( '../../../../app/controllers/controller.uk-regions', {
			'../lib/service/service.backend': { export: exportBackendService },
			'../lib/render-error': errorHandler,
			'../lib/sort-wins': sortWins,
			'../lib/view-models/uk-region-summary': regionSummary,
			'../lib/view-models/uk-region-performance': regionPerformance,
			'../lib/view-models/uk-regions-overview-summary': overviewSummary,
			'../lib/view-models/uk-regions-overview-regions': overviewRegions,
			'../lib/view-models/top-markets': topMarkets,
			'../lib/view-models/monthly-performance': monthlyPerformance
		} );
	} );

	describe( 'Overview', function(){

		it( 'Should get the overview data and render the correct view', function( done ){

			const req = {
				cookies: { sessionid: '456' },
				year
			};

			const ukRegions = {
				date_range: 'a date range',
				results: {
					summary: {
						non_hvc: 'the summary'
					},
					region_groups: [ {
						name: 'test',
						regions: [ 'a region' ]
					} ]
				}
			};

			const overviewSummaryResponse = { overviewSummaryResponse: true };
			const overviewRegionsResponse = { overviewRegionsResponse: true };

			const promise = new Promise( ( resolve ) => { resolve( ukRegions ); } );

			exportBackendService.getUkRegionsOverview = spy( 'getUkRegionsOverview', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			overviewSummary.create = spy( 'overviewSummary.create', overviewSummaryResponse );
			overviewRegions.create = spy( 'overviewRegions.create', overviewRegionsResponse );

			controller.overview( req, res );

			promise.then( () => {

				expect( exportBackendService.getUkRegionsOverview ).toHaveBeenCalledWith( req );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );

				expect( overviewSummary.create ).toHaveBeenCalledWith( ukRegions.date_range, ukRegions.results.summary );
				expect( overviewRegions.create ).toHaveBeenCalledWith( ukRegions.date_range, ukRegions.results.region_groups );

				expect( res.render ).toHaveBeenCalledWith( 'uk-regions/overview.html', {
					summary: overviewSummaryResponse,
					regionGroups: overviewRegionsResponse
				} );

				done();
			} );
		} );
	} );

	describe( 'Top Non HVcs', function(){

		it( 'Should get the list data and render the correct view', function( done ){

			const req = {
				cookies: { sessionid: '456' },
				params: { id: 'SI' },
				year
			};

			const topNonHvcs = { results: { 'topNonHvcs': true } };

			const promise = new Promise( ( resolve ) => { resolve( topNonHvcs ); } );

			exportBackendService.getUkRegionTopNonHvc = spy( 'getUkRegionTopNonHvc', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.topNonHvcs( req, res );

			promise.then( () => {

				expect( exportBackendService.getUkRegionTopNonHvc ).toHaveBeenCalledWith( req, req.params.id, true );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
				expect( res.render ).toHaveBeenCalledWith( 'partials/top-non-hvcs.html', {
					topNonHvcs: topNonHvcs.results
				} );
				done();
			} );
		} );
	} );

	describe( 'UK Region', function(){

		it( 'Should get the data and render the correct view', function( done ){

			const regionName = 'my test ukRegion';
			const regionId = 'SI';

			const req = {
				cookies: { sessionid: '456' },
				params: { id: regionId },
				query: {},
				year
			};

			const ukRegion = { results: { ukRegion: true, name: regionName } };

			const regionSummaryResponse = { 'regionSummaryResponse': true };
			const regionPerformanceResponse = { 'regionPerformanceResponse': true };
			const topMarketsResponse = { 'topMarketsResponse': true };
			const monthlyPerformanceResponse = { 'monthlyPerformanceResponse': true };

			const data = {
				wins: ukRegion,
				campaigns: [ 'test-campaigns' ],
				months: [ 'test-months' ],
				topNonHvc: { top: { non: 'hvc' } }
			};

			const promise = new Promise( ( resolve ) => { resolve( data ); } );

			exportBackendService.getUkRegionInfo = spy( 'getUkRegionInfo', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			regionSummary.create = spy( 'regionSummary.create', regionSummaryResponse );
			regionPerformance.create = spy( 'regionPerformance.create', regionPerformanceResponse );
			topMarkets.create = spy( 'topMarkets.create', topMarketsResponse );
			monthlyPerformance.create = spy( 'monthlyPerformance.create', monthlyPerformanceResponse );

			controller.region( req, res );

			promise.then( () => {

				expect( exportBackendService.getUkRegionInfo ).toHaveBeenCalledWith( req, regionId );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );

				expect( regionSummary.create ).toHaveBeenCalledWith( data.wins );
				expect( regionPerformance.create ).toHaveBeenCalledWith( data.wins );
				expect( topMarkets.create ).toHaveBeenCalledWith( data.topNonHvc );
				expect( monthlyPerformance.create ).toHaveBeenCalledWith( data.months );

				expect( res.render ).toHaveBeenCalledWith( 'uk-regions/detail.html', {
					regionId,
					regionName,
					dateRange: ukRegion.date_range,
					summary: regionSummaryResponse,
					performance: regionPerformanceResponse,
					topMarkets: topMarketsResponse,
					monthlyPerformance: monthlyPerformanceResponse,
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

				const ukRegionWins = {
					date_range: { start: 6, end: 9 },
					results: {
						uk_region: { test: 1 },
						wins: [ 'some wins' ]
					}
				};

				const promise = new Promise( ( resolve ) => { resolve( ukRegionWins ); } );

				exportBackendService.getUkRegionWinTable = spy( 'getUkRegionWinTable', promise );
				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

				controller[ methodName ]( req, res );

				promise.then( () => {

					expect( exportBackendService.getUkRegionWinTable ).toHaveBeenCalledWith( req, regionId );
					expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
					expect( sortWins ).toHaveBeenCalledWith( ukRegionWins.results.wins[ type ], sort );
					expect( res.render ).toHaveBeenCalledWith( view, {
						dateRange: ukRegionWins.date_range,
						region: ukRegionWins.results.uk_region,
						wins: sortWinsResponse
					} );
					done();
				} );
			} );
		}

		checkWins( 'wins', 'hvc', 'uk-regions/wins.html' );
		checkWins( 'nonHvcWins', 'non_hvc', 'uk-regions/non-hvc-wins.html' );
	} );
} );
