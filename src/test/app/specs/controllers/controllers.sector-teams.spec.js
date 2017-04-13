const proxyquire = require( 'proxyquire' );

const backendService = require( '../../../../app/lib/service/service.backend' );
const errorHandler = require( '../../../../app/lib/render-error' );
const sectorSummary = require( '../../../../app/lib/view-models/sector-summary' );
const hvcSummary = require( '../../../../app/lib/view-models/sector-hvc-summary' );
const hvcTargetPerformance = require( '../../../../app/lib/view-models/hvc-target-performance' );
const topMarkets = require( '../../../../app/lib/view-models/top-markets' );
const monthlyPerformance = require( '../../../../app/lib/view-models/monthly-performance' );

const interceptBackend = require( '../../helpers/intercept-backend' );

let controller;

describe( 'Sector Teams controller', function(){

	let oldTimeout;

	beforeEach( function(){

		oldTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
	} );

	afterEach( function(){

		jasmine.DEFAULT_TIMEOUT_INTERVAL = oldTimeout;
	} );

	beforeEach( function(){

		const stubs = {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../lib/view-models/sector-summary': sectorSummary,
			'../lib/view-models/sector-hvc-summary': hvcSummary,
			'../lib/view-models/hvc-target-performance': hvcTargetPerformance,
			'../lib/view-models/top-markets': topMarkets,
			'../lib/view-models/monthly-performance': monthlyPerformance
		};

		controller = proxyquire( '../../../../app/controllers/controller.sector-teams', stubs );
	} );

	describe( 'Overview', function(){

		it( 'Should get the overview data and render the correct view', function( done ){

			const req = {
				alice: '123'
			};

			spyOn( backendService, 'getSectorTeamsOverview' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callFake( () => done );

			interceptBackend.getStub( '/mi/sector_teams/overview/', 200, '/sector_teams/overview' );

			controller.overview( req, { render: function( view, data ){

				expect( backendService.getSectorTeamsOverview ).toHaveBeenCalledWith( req.alice );
				expect( data.dateRange ).toBeDefined();
				expect( data.sectorTeams ).toBeDefined();
				expect( data.sectorTeams.length ).toBeGreaterThan( 1 );
				expect( view ).toEqual( 'sector-teams/overview' );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} } );
		} );
	} );

	describe( 'List', function(){

		it( 'Should get the list data and render the correct view', function( done ){

			const req = {
				alice: '87654'
			};

			spyOn( backendService, 'getSectorTeams' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callFake( () => done );

			interceptBackend.getStub( '/mi/sector_teams/', 200, '/sector_teams/' );

			controller.list( req, { render: function( view, data ){

				expect( backendService.getSectorTeams ).toHaveBeenCalledWith( req.alice );
				expect( view ).toEqual( 'sector-teams/list.html' );
				expect( data.sectorTeams ).toBeDefined();
				expect( data.sectorTeams.length ).toBeGreaterThan( 1 );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} } );
		} );
	} );

	describe( 'Team', function(){

		it( 'Should get the team data and render the correct view', function( done ){

			const req = {
				alice: '1234',
				params: {
					id: 1234
				}
			};

			const teamId = req.params.id;

			spyOn( backendService, 'getSectorTeamInfo' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callFake( () => done );
			spyOn( sectorSummary, 'create' ).and.callThrough();
			spyOn( hvcSummary, 'create' ).and.callThrough();
			spyOn( hvcTargetPerformance, 'create' ).and.callThrough();
			spyOn( topMarkets, 'create' ).and.callThrough();
			spyOn( monthlyPerformance, 'create' ).and.callThrough();

			interceptBackend.getStub( `/mi/sector_teams/${ teamId }/`, 200, '/sector_teams/sector_team' );
			interceptBackend.getStub( `/mi/sector_teams/${ teamId }/months/`, 200, '/sector_teams/months' );
			interceptBackend.getStub( `/mi/sector_teams/${ teamId }/campaigns/`, 200, '/sector_teams/campaigns' );
			interceptBackend.getStub( `/mi/sector_teams/${ teamId }/top_non_hvcs/`, 200, '/sector_teams/top_non_hvcs' );

			controller.team( req, { render: function( view, data ){

				expect( backendService.getSectorTeamInfo ).toHaveBeenCalledWith( req.alice, teamId );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( sectorSummary.create ).toHaveBeenCalled();
				expect( hvcSummary.create ).toHaveBeenCalled();
				expect( hvcTargetPerformance.create ).toHaveBeenCalled();
				expect( topMarkets.create ).toHaveBeenCalled();
				expect( monthlyPerformance.create ).toHaveBeenCalled();

				expect( data.sectorName ).toBeDefined();
				expect( data.summary ).toBeDefined();
				expect( data.hvcSummary ).toBeDefined();
				expect( data.hvcTargetPerformance ).toBeDefined();
				expect( data.monthlyPerformance ).toBeDefined();
				expect( data.topMarkets ).toBeDefined();

				expect( view ).toEqual( 'sector-teams/detail.html' );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} } );
		} );
	} );
} );
