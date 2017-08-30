const proxyquire = require( 'proxyquire' );

const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

const year = 2017;

let backendService;
let errorHandler;

let res;
let controller;

let regionSummary;
let topMarkets;

describe( 'UK Regions controller', function(){

	beforeEach( function(){

		backendService = {};
		errorHandler = { createHandler: spy( 'errorHandler.createHandler' ) };

		regionSummary = {};
		topMarkets = {};

		res = {
			render: spy( 'res.render' )
		};

		controller = proxyquire( '../../../../app/controllers/controller.uk-regions', {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../lib/view-models/uk-region-summary': regionSummary,
			'../lib/view-models/top-markets': topMarkets
		} );
	} );

	describe( 'List', function(){

		it( 'Should get the list data and render the correct view', function( done ){

			const req = {
				cookies: { sessionid: '456' },
				year
			};

			const ukRegions = { results: { 'ukRegions': true } };

			const promise = new Promise( ( resolve ) => { resolve( ukRegions ); } );

			backendService.getUkRegions = spy( 'getUkRegions', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.list( req, res );

			promise.then( () => {

				expect( backendService.getUkRegions ).toHaveBeenCalledWith( req );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );
				expect( res.render ).toHaveBeenCalledWith( 'uk-regions/list.html', { regions: ukRegions.results } );
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
			const topMarketsResponse = { 'topMarketsResponse': true };

			const data = {
				wins: ukRegion,
				campaigns: [ 'test-campaigns' ],
				months: [ 'test-months' ],
				topNonHvc: { top: { non: 'hvc' } }
			};

			const promise = new Promise( ( resolve ) => { resolve( data ); } );

			backendService.getUkRegionInfo = spy( 'getUkRegionInfo', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			regionSummary.create = spy( 'regionSummary.create', regionSummaryResponse );
			topMarkets.create = spy( 'topMarkets.create', topMarketsResponse );

			controller.region( req, res );

			promise.then( () => {

				expect( backendService.getUkRegionInfo ).toHaveBeenCalledWith( req, regionId );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );

				expect( regionSummary.create ).toHaveBeenCalledWith( data.wins );
				expect( topMarkets.create ).toHaveBeenCalledWith( data.topNonHvc );

				expect( res.render ).toHaveBeenCalledWith( 'uk-regions/detail.html', {
					regionId,
					regionName,
					dateRange: ukRegion.date_range,
					summary: regionSummaryResponse,
					topMarkets: topMarketsResponse
				} );
				done();
			} );
		} );
	} );

	describe( 'Win Lists', function(){

		function checkWins( methodName, view ){

			it( 'Should get the list of wins and render the correct view', function( done ){

			const regionId = 890;

			const req = {
				cookies: { sessionid: '456' },
				params: {
					id: regionId
				},
				year
			};

			const ukRegionWins = {
				date_range: { start: 6, end: 9 },
				results: {
					uk_region: { test: 1 },
					wins: [ 'some wins' ]
				}
			};

			const promise = new Promise( ( resolve ) => { resolve( ukRegionWins ); } );

			backendService.getUkRegionWinTable = spy( 'getUkRegionWinTable', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller[ methodName ]( req, res );

			promise.then( () => {

				expect( backendService.getUkRegionWinTable ).toHaveBeenCalledWith( req, regionId );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );
				expect( res.render ).toHaveBeenCalledWith( view, {
					dateRange: ukRegionWins.date_range,
					region: ukRegionWins.results.uk_region,
					wins: ukRegionWins.results.wins
				} );
				done();
			} );
		} );
		}

		checkWins( 'wins', 'uk-regions/wins.html' );
		checkWins( 'nonHvcWins', 'uk-regions/non-hvc-wins.html' );
	} );
} );
