const proxyquire = require( 'proxyquire' );

const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

const year = 2017;

let backendService;
let errorHandler;
let sortWins;
let sortWinsResponse;

let res;
let controller;

let sectorSummary;
let hvcSummary;
let hvcTargetPerformance;
let topMarkets;
let monthlyPerformance;

describe( 'Countries controller', function(){

	beforeEach( function(){

		sortWinsResponse = { some: 'wins' };

		backendService = {};
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

		controller = proxyquire( '../../../../app/controllers/controller.countries', {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../lib/sort-wins': sortWins,
			'../lib/view-models/sector-summary': sectorSummary,
			'../lib/view-models/sector-hvc-summary': hvcSummary,
			'../lib/view-models/hvc-target-performance': hvcTargetPerformance,
			'../lib/view-models/top-markets': topMarkets,
			'../lib/view-models/monthly-performance': monthlyPerformance
		} );
	} );

	describe( 'List', function(){

		it( 'Should get the list data and render the correct view', function( done ){

			const req = {
				cookies: { sessionid: '456' },
				year
			};

			const countries = { results: { 'countries': true } };

			const promise = new Promise( ( resolve ) => { resolve( countries ); } );

			backendService.getCountries = spy( 'getCountries', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.list( req, res );

			promise.then( () => {

				expect( backendService.getCountries ).toHaveBeenCalledWith( req );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );
				expect( res.render ).toHaveBeenCalledWith( 'countries/list.html', { countries: countries.results } );
				done();
			} );
		} );
	} );

	describe( 'Country', function(){

		it( 'Should get the data and render the correct view', function( done ){

			const countryName = 'my test country';
			const countryCode = 'SI';

			const req = {
				cookies: { sessionid: '456' },
				params: { code: countryCode },
				year
			};

			const country = { results: { country: true, name: countryName } };

			const sectorSummaryResponse = { 'sectorSummaryResponse': true };
			const hvcSummaryResponse = { 'hvcSummaryResponse': true };
			const hvcTargetPerformanceResponse = { 'hvcTargetPerformanceResponse': true };
			const topMarketsResponse = { 'topMarketsResponse': true };
			const monthlyPerformanceResponse = { 'monthlyPerformanceResponse': true };

			const data = {
				wins: country,
				campaigns: [ 'test-campaigns' ],
				months: [ 'test-months' ],
				topNonHvc: { top: { non: 'hvc' } }
			};

			const promise = new Promise( ( resolve ) => { resolve( data ); } );

			backendService.getCountryInfo = spy( 'getCountryInfo', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			sectorSummary.create = spy( 'sectorSummary.create', sectorSummaryResponse );
			hvcSummary.create = spy( 'hvcSummary.create', hvcSummaryResponse );
			hvcTargetPerformance.create = spy( 'hvcTargetPerformance.create', hvcTargetPerformanceResponse );
			topMarkets.create = spy( 'topMarkets.create', topMarketsResponse );
			monthlyPerformance.create = spy( 'monthlyPerformance.create', monthlyPerformanceResponse );

			controller.country( req, res );

			promise.then( () => {

				expect( backendService.getCountryInfo ).toHaveBeenCalledWith( req, countryCode );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );

				expect( sectorSummary.create ).toHaveBeenCalledWith( data.wins );
				expect( hvcSummary.create ).toHaveBeenCalledWith( data.wins );
				expect( hvcTargetPerformance.create ).toHaveBeenCalledWith( data.campaigns );
				expect( monthlyPerformance.create ).toHaveBeenCalledWith( data.months );
				expect( topMarkets.create ).toHaveBeenCalledWith( data.topNonHvc );

				expect( res.render ).toHaveBeenCalledWith( 'countries/detail.html', {
					countryCode,
					countryName,
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

				const countryId = 890;
				const sort = { some: 'sort', params: true };

				const req = {
					cookies: { sessionid: '456' },
					params: {
						code: countryId
					},
					year,
					query: { sort }
				};

				const countryWins = {
					date_range: { start: 6, end: 9 },
					results: {
						country: { test: 1 },
						wins: {
							hvc: [ 'some HVC wins' ],
							non_hvc: [ 'some non HVC wins' ]
						}
					}
				};

				const promise = new Promise( ( resolve ) => { resolve( countryWins ); } );

				backendService.getCountryWinTable = spy( 'getCountryWinTable', promise );
				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

				controller[ methodName ]( req, res );

				promise.then( () => {

					expect( backendService.getCountryWinTable ).toHaveBeenCalledWith( req, countryId );
					expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );
					expect( sortWins ).toHaveBeenCalledWith( countryWins.results.wins[ type ], sort );
					expect( res.render ).toHaveBeenCalledWith( view, {
						dateRange: countryWins.date_range,
						country: countryWins.results.country,
						wins: sortWinsResponse
					} );
					done();
				} );
			} );
		}

		checkWins( 'wins', 'hvc', 'countries/wins.html' );
		checkWins( 'nonHvcWins', 'non_hvc', 'countries/non-hvc-wins.html' );
	} );
} );
