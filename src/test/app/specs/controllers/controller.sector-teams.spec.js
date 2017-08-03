const proxyquire = require( 'proxyquire' );

const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

const year = 2017;

let backendService;
let errorHandler;
let sectorSummary;
let hvcSummary;
let hvcTargetPerformance;
let topMarkets;
let monthlyPerformance;

let res;
let controller;

describe( 'Sector Teams controller', function(){

	beforeEach( function(){

		backendService = {};
		errorHandler = { createHandler: spy( 'errorHandler.createHandler' ) };
		sectorSummary = {};
		hvcSummary = {};
		hvcTargetPerformance = {};
		topMarkets = {};
		monthlyPerformance = {};

		res = {
			render: spy( 'res.render' )
		};

		controller = proxyquire( '../../../../app/controllers/controller.sector-teams', {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
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

			backendService.getSectorTeamsOverview = spy( 'getSectorTeamsOverview', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.overview( req, res );

			promise.then( () => {
				expect( backendService.getSectorTeamsOverview ).toHaveBeenCalledWith( req );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );
				expect( res.render ).toHaveBeenCalledWith( 'sector-teams/overview', {
					dateRange: sectorTeams.date_range,
					sectorTeams: sectorTeams.results
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

			const sectorTeams = {
				results: [ 'some list restuls' ]
			};

			const promise = new Promise( ( resolve ) => { resolve( sectorTeams ); } );

			backendService.getSectorTeams = spy( 'getSectorTeams', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.list( req, res );

			promise.then( () => {
				expect( backendService.getSectorTeams ).toHaveBeenCalledWith( req );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );
				expect( res.render ).toHaveBeenCalledWith( 'sector-teams/list.html', {
					sectorTeams: sectorTeams.results
				} );
				done();
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

			backendService.getSectorTeamInfo = spy( 'getSectorTeamInfo', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );


			sectorSummary.create = spy( 'sectorSummary', sectorSummaryResponse );
			hvcSummary.create = spy( 'hvcSummary', hvcSummaryResponse );
			hvcTargetPerformance.create = spy( 'hvcTargetPerformance', hvcTargetPerformanceResponse );
			topMarkets.create = spy( 'topMarkets', topMarketsResponse );
			monthlyPerformance.create = spy( 'monthlyPerformance', monthlyPerformanceResponse );

			controller.team( req, res );

			promise.then( () => {

				expect( backendService.getSectorTeamInfo ).toHaveBeenCalledWith( req, teamId );
				expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );

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
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} );
		} );
	} );

	describe( 'Wins', function(){

		function checkWins( methodName, view ){

			it( 'Should get the list of wins and render the correct view', function( done ){

				const teamId = 456;

				const req = {
					cookies: { sessionid: '456' },
					params: {
						id: teamId
					},
					year
				};

				const sectorTeamWins = {
					date_range: { start: 2, end: 3 },
					results: {
						sector_team: { test: 1 },
						wins: { wins: true }
					}
				};

				const promise = new Promise( ( resolve ) => { resolve( sectorTeamWins ); } );

				backendService.getSectorTeamWinTable = spy( 'getSectorTeamWinTable', promise );
				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

				controller[ methodName ]( req, res );

				promise.then( () => {
					expect( backendService.getSectorTeamWinTable ).toHaveBeenCalledWith( req, teamId );
					expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );
					expect( res.render ).toHaveBeenCalledWith( view, {
						dateRange: sectorTeamWins.date_range,
						sectorTeam: sectorTeamWins.results.sector_team,
						wins: sectorTeamWins.results.wins
					} );
					done();
				} );
			} );
		}

		checkWins( 'wins', 'sector-teams/wins.html' );
		checkWins( 'nonHvcWins', 'sector-teams/non-hvc-wins.html' );
	} );
} );
