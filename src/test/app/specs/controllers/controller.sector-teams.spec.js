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
let analyticsService;
let mockTracker;

let res;
let controller;

describe( 'Sector Teams controller', function(){

	beforeEach( function(){

		sortWinsResponse = { some: 'wins' };

		mockTracker = null;
		exportBackendService = {};
		errorHandler = { createHandler: spy( 'errorHandler.createHandler' ) };
		sortWins = spy( 'sortWins', sortWinsResponse );
		analyticsService = {
			createTracker: jasmine.createSpy( 'analyticsService.createTracker' ).and.callFake( () => mockTracker )
		};

		sectorSummary = {};
		hvcSummary = {};
		hvcTargetPerformance = {};
		topMarkets = {};
		monthlyPerformance = {};

		res = {
			render: spy( 'res.render' )
		};

		controller = proxyquire( '../../../../app/controllers/controller.sector-teams', {
			'../lib/service/service.backend': { export: exportBackendService },
			'../lib/service/analytics': analyticsService,
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

		it( 'Should get the overview data and render the correct view', function( done ){

			const req = {
				cookies: { sessionid: '123' },
				year
			};

			const sectorTeams = {
				date_range: { date: 'range' },
				results: [ 'some results' ]
			};

			const promise = new Promise( ( resolve ) => { resolve( sectorTeams ); } );

			exportBackendService.getSectorTeamsOverview = spy( 'getSectorTeamsOverview', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.overview( req, res );

			promise.then( () => {
				expect( exportBackendService.getSectorTeamsOverview ).toHaveBeenCalledWith( req );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
				expect( res.render ).toHaveBeenCalledWith( 'sector-teams/overview', {
					dateRange: sectorTeams.date_range,
					sectorTeams: sectorTeams.results
				} );
				done();
			} );
		} );
	} );

	describe( 'Top Non HVC', function(){

		let req;
		let topNonHvcs;
		let promise;

		beforeEach( function(){

			req = {
				cookies: { sessionid: '456' },
				year,
				url: '/a/url/',
				params: {
					id: 1234
				}
			};

			topNonHvcs = {
				results: [ 'some list results' ]
			};

			promise = new Promise( ( resolve ) => { resolve( topNonHvcs ); } );
			exportBackendService.getSectorTeamTopNonHvc = spy( 'getSectorTeamTopNonHvc', promise );
		} );

		describe( 'When an analytics tracker is created', function(){

			it( 'Should get the list data, render the correct view and track the event', function( done ){

				mockTracker = {
					loadAllTopMarkets: jasmine.createSpy( 'loadAllTopMarkets' )
				};

				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

				controller.topNonHvcs( req, res );

				promise.then( () => {
					expect( exportBackendService.getSectorTeamTopNonHvc ).toHaveBeenCalledWith( req, req.params.id, true );
					expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
					expect( res.render ).toHaveBeenCalledWith( 'partials/top-non-hvcs.html', {
						topNonHvcs: topNonHvcs.results
					} );
					expect( analyticsService.createTracker ).toHaveBeenCalledWith( req );
					expect( mockTracker.loadAllTopMarkets ).toHaveBeenCalledWith( req.url, 'Export Sector Team', req.params.id  );
					done();
				} );
			} );
		} );

		describe( 'When an analytics tracker is not created', function(){

			it( 'Should not throw an error', function( done ){

				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

				controller.topNonHvcs( req, res );

				promise.then( () => {

					expect( exportBackendService.getSectorTeamTopNonHvc ).toHaveBeenCalledWith( req, req.params.id, true );
					expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
					expect( res.render ).toHaveBeenCalledWith( 'partials/top-non-hvcs.html', {
						topNonHvcs: topNonHvcs.results
					} );
					expect( analyticsService.createTracker ).toHaveBeenCalledWith( req );
					done();
				} );
			} );
		} );
	} );

	describe( 'Team', function(){

		it( 'Should get the team data and render the correct view', function( done ){

			const req = {
				cookies: { sessionid: '789' },
				year,
				params: {
					id: 1234
				}
			};

			const teamId = req.params.id;

			const teamInfo = {
				wins: { results: { name: 'sector team name' } },
				campaigns: [ 'some campaigns' ],
				months: [ 'some months' ],
				topNonHvc: { 'some': 'non hvc' }
			};

			const sectorSummaryResponse = { sectorSummary: true };
			const hvcSummaryResponse = { hvcSummary: true };
			const hvcTargetPerformanceResponse = { hvcTargetPerformance: true };
			const topMarketsResponse = { topMarkets: true };
			const monthlyPerformanceResponse = { monthlyPerformance: true };

			const promise = new Promise( ( resolve ) => { resolve( teamInfo ); } );

			exportBackendService.getSectorTeamInfo = spy( 'getSectorTeamInfo', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );


			sectorSummary.create = spy( 'sectorSummary', sectorSummaryResponse );
			hvcSummary.create = spy( 'hvcSummary', hvcSummaryResponse );
			hvcTargetPerformance.create = spy( 'hvcTargetPerformance', hvcTargetPerformanceResponse );
			topMarkets.create = spy( 'topMarkets', topMarketsResponse );
			monthlyPerformance.create = spy( 'monthlyPerformance', monthlyPerformanceResponse );

			controller.team( req, res );

			promise.then( () => {

				expect( exportBackendService.getSectorTeamInfo ).toHaveBeenCalledWith( req, teamId );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );

				expect( sectorSummary.create ).toHaveBeenCalledWith( teamInfo.wins );
				expect( hvcSummary.create ).toHaveBeenCalledWith( teamInfo.wins );
				expect( hvcTargetPerformance.create ).toHaveBeenCalledWith( teamInfo.campaigns );
				expect( monthlyPerformance.create ).toHaveBeenCalledWith( teamInfo.months );
				expect( topMarkets.create ).toHaveBeenCalledWith( teamInfo.topNonHvc );


				expect( res.render ).toHaveBeenCalledWith( 'sector-teams/detail.html', {
					teamId,
					teamName: teamInfo.wins.results.name,
					sectorName: ( teamInfo.wins.results.name + ' Sector Team' ),
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

	describe( 'Wins', function(){

		function checkWins( methodName, type, view ){

			it( 'Should get the list of wins and render the correct view', function( done ){

				const teamId = 456;
				const sort = { some: 'sort', params: true };

				const req = {
					cookies: { sessionid: '456' },
					params: {
						id: teamId
					},
					year,
					query: { sort }
				};

				const sectorTeamWins = {
					date_range: { start: 2, end: 3 },
					results: {
						sector_team: { test: 1 },
						wins: {
							hvc: [ 'some HVC wins' ],
							non_hvc: [ 'some non HVC wins' ]
						}
					}
				};

				const promise = new Promise( ( resolve ) => { resolve( sectorTeamWins ); } );

				exportBackendService.getSectorTeamWinTable = spy( 'getSectorTeamWinTable', promise );
				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

				controller[ methodName ]( req, res );

				promise.then( () => {
					expect( exportBackendService.getSectorTeamWinTable ).toHaveBeenCalledWith( req, teamId );
					expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
					expect( sortWins ).toHaveBeenCalledWith( sectorTeamWins.results.wins[ type ], sort );
					expect( res.render ).toHaveBeenCalledWith( view, {
						dateRange: sectorTeamWins.date_range,
						sectorTeam: sectorTeamWins.results.sector_team,
						wins: sortWinsResponse
					} );
					done();
				} );
			} );
		}

		checkWins( 'wins', 'hvc', 'sector-teams/wins.html' );
		checkWins( 'nonHvcWins', 'non_hvc', 'sector-teams/non-hvc-wins.html' );
	} );
} );
