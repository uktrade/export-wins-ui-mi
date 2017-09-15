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

let sectorSummary;
let hvcSummary;
let hvcTargetPerformance;
let topMarkets;
let monthlyPerformance;

describe( 'Posts controller', function(){

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

		controller = proxyquire( '../../../../app/controllers/controller.posts', {
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

	describe( 'List', function(){

		it( 'Should get the list data and render the correct view', function( done ){

			const req = {
				cookies: { sessionid: '456' },
				year
			};

			const posts = { results: { 'posts': true } };

			const promise = new Promise( ( resolve ) => { resolve( posts ); } );

			exportBackendService.getPosts = spy( 'getPosts', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.list( req, res );

			promise.then( () => {

				expect( exportBackendService.getPosts ).toHaveBeenCalledWith( req );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );
				expect( res.render ).toHaveBeenCalledWith( 'posts/list.html', { posts: posts.results } );
				done();
			} );
		} );
	} );

	describe( 'Post', function(){

		it( 'Should get the data and render the correct view', function( done ){

			const postName = 'my test post';
			const postId = 'SI';

			const req = {
				cookies: { sessionid: '456' },
				params: { id: postId },
				year
			};

			const post = { results: { post: true, name: postName } };

			const sectorSummaryResponse = { 'sectorSummaryResponse': true };
			const hvcSummaryResponse = { 'hvcSummaryResponse': true };
			const hvcTargetPerformanceResponse = { 'hvcTargetPerformanceResponse': true };
			const topMarketsResponse = { 'topMarketsResponse': true };
			const monthlyPerformanceResponse = { 'monthlyPerformanceResponse': true };

			const data = {
				wins: post,
				campaigns: [ 'test-campaigns' ],
				months: [ 'test-months' ],
				topNonHvc: { top: { non: 'hvc' } }
			};

			const promise = new Promise( ( resolve ) => { resolve( data ); } );

			exportBackendService.getPostInfo = spy( 'getPostInfo', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			sectorSummary.create = spy( 'sectorSummary.create', sectorSummaryResponse );
			hvcSummary.create = spy( 'hvcSummary.create', hvcSummaryResponse );
			hvcTargetPerformance.create = spy( 'hvcTargetPerformance.create', hvcTargetPerformanceResponse );
			topMarkets.create = spy( 'topMarkets.create', topMarketsResponse );
			monthlyPerformance.create = spy( 'monthlyPerformance.create', monthlyPerformanceResponse );

			controller.post( req, res );

			promise.then( () => {

				expect( exportBackendService.getPostInfo ).toHaveBeenCalledWith( req, postId );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );

				expect( sectorSummary.create ).toHaveBeenCalledWith( data.wins );
				expect( hvcSummary.create ).toHaveBeenCalledWith( data.wins );
				expect( hvcTargetPerformance.create ).toHaveBeenCalledWith( data.campaigns );
				expect( monthlyPerformance.create ).toHaveBeenCalledWith( data.months );
				expect( topMarkets.create ).toHaveBeenCalledWith( data.topNonHvc );

				expect( res.render ).toHaveBeenCalledWith( 'posts/detail.html', {
					postId,
					postName,
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

				const postId = 890;
				const sort = { some: 'sort', params: true };

				const req = {
					cookies: { sessionid: '456' },
					params: {
						id: postId
					},
					year,
					query: { sort }
				};

				const postWins = {
					date_range: { start: 6, end: 9 },
					results: {
						post: { test: 1 },
						wins: [ 'some wins' ]
					}
				};

				const promise = new Promise( ( resolve ) => { resolve( postWins ); } );

				exportBackendService.getPostWinTable = spy( 'getPostWinTable', promise );
				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

				controller[ methodName ]( req, res );

				promise.then( () => {

					expect( exportBackendService.getPostWinTable ).toHaveBeenCalledWith( req, postId );
					expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );
					expect( sortWins ).toHaveBeenCalledWith( postWins.results.wins[ type ], sort );
					expect( res.render ).toHaveBeenCalledWith( view, {
						dateRange: postWins.date_range,
						post: postWins.results.post,
						wins: sortWinsResponse
					} );
					done();
				} );
			} );
		}

		checkWins( 'wins', 'hvc', 'posts/wins.html' );
		checkWins( 'nonHvcWins', 'non_hvc', 'posts/non-hvc-wins.html' );
	} );
} );
