const proxyquire = require( 'proxyquire' );
const backendService = require( '../../../../app/lib/service/service.backend' );
const errorHandler = require( '../../../../app/lib/render-error' );
const interceptBackend = require( '../../helpers/intercept-backend' );

let controller;

describe( 'Overseas Regions controller', function(){

	beforeEach( function(){

		const stubs = {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler
		};

		controller = proxyquire( '../../../../app/controllers/controller.sector-teams', stubs );
	} );

	describe( 'Overview', function(){
	
		it( 'Should get the overview data and render the correct view', function( done ){

			const req = {
				alice: '123'
			};

			spyOn( backendService, 'getSectorTeamsOverview' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callThrough();

			interceptBackend.getStub( '/mi/sector_teams/overview/', 200, '/sector_teams/overview' );

			controller.overview( req, { render: function( view, data ){

				expect( backendService.getSectorTeamsOverview ).toHaveBeenCalledWith( req.alice );
				expect( data.sectorTeams ).toBeDefined();
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
			spyOn( errorHandler, 'createHandler' ).and.callThrough();

			interceptBackend.getStub( '/mi/sector_teams/', 200, '/sector_teams/' );

			controller.list( req, { render: function( view, data ){

				expect( backendService.getSectorTeams ).toHaveBeenCalledWith( req.alice );
				expect( view ).toEqual( 'sector-teams/list.html' );
				expect( data.sectorTeams ).toBeDefined();
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
			spyOn( errorHandler, 'createHandler' ).and.callThrough();

			interceptBackend.getStub( `/mi/sector_teams/${ teamId }/`, 200, '/sector_teams/sector_team' );
			interceptBackend.getStub( `/mi/sector_teams/${ teamId }/months/`, 200, '/sector_teams/months' );
			interceptBackend.getStub( `/mi/sector_teams/${ teamId }/campaigns/`, 200, '/sector_teams/campaigns' );
			interceptBackend.getStub( `/mi/sector_teams/${ teamId }/top_non_hvcs/`, 200, '/sector_teams/top_non_hvcs' );

			controller.team( req, { render: function( view, data ){

				expect( backendService.getSectorTeamInfo ).toHaveBeenCalledWith( req.alice, teamId );
				expect( view ).toEqual( 'sector-teams/detail.html' );
				expect( data.sectorName ).toBeDefined();
				expect( data.winSummary ).toBeDefined();
				expect( data.hvcTargetPerformance ).toBeDefined();
				expect( data.sectorPerformance ).toBeDefined();
				expect( data.topNonHvc ).toBeDefined();
				expect( data.topNonHvcScale ).toBeDefined();
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} } );
		} );
	} );
} );
