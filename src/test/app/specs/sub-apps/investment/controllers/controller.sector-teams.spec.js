const proxyquire = require( 'proxyquire' );

const moduleFile = '../../../../../../app/sub-apps/investment/controllers/controller.sector-teams';

let controller;
let investmentService;
let createHandler;
let renderErrorHandler;
let req;
let res;

describe( 'Investment Sector Teams controller', function(){

	beforeEach( function(){

		renderErrorHandler = jasmine.createSpy( 'renderErrorHandler' );
		createHandler = jasmine.createSpy( 'createHandler' ).and.callFake( () => renderErrorHandler );

		investmentService = {
			getSectorTeams: jasmine.createSpy( 'getSectorTeams' ),
			getSectorTeam: jasmine.createSpy( 'getSectorTeam' )
		};

		controller = proxyquire( moduleFile, {
			'../../../lib/service/service.backend/investment': investmentService,
			'../../../lib/render-error': { createHandler }
		} );

		req = {
			cookies: { sessionid: '456' },
			query: {},
			year: 2017
		};

		res = {
			render: jasmine.createSpy( 'res.render' ),
			status: jasmine.createSpy( 'res.status' )
		};
	} );

	describe( 'Sector Teams', function(){

		describe( 'With success', function(){

			it( 'Should render the view with the correct data', function( done ){

				const sectorTeams = { sectorTeams: true };
				const promise = new Promise( ( resolve ) => {
					resolve( { sectorTeams } );
				} );

				investmentService.getSectorTeams.and.callFake( () => promise );

				controller.sectorTeams( req, res );

				expect( createHandler ).toHaveBeenCalledWith( res );

				promise.then( ( data ) => {

					expect( investmentService.getSectorTeams ).toHaveBeenCalledWith( req );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/sector-teams/overview', { sectorTeams: data } );
					done();
				} );
			} );
		} );

		describe( 'With a failure', function(){

			it( 'Should call render error', function( done ){

				const err = new Error( 'some error' );
				let rejectPromise;

				const promise = new Promise( ( resolve, reject ) => {
					rejectPromise = reject;
				} );

				investmentService.getSectorTeams.and.callFake( () => promise );

				controller.sectorTeams( req, res );

				expect( createHandler ).toHaveBeenCalledWith( res );

				rejectPromise( err );

				setTimeout( () => {

					expect( investmentService.getSectorTeams ).toHaveBeenCalledWith( req );
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );

	describe( 'Sector Team', function(){

		describe( 'With success', function(){

			it( 'Should render the view with the correct data', function( done ){

				const teamId = '1';
				const sectorTeamResponse = { date_range: { start: 1, end: 2 }, results: { id: 1, name: 'abc' } };
				const promise =  new Promise( ( resolve ) => {
					resolve( sectorTeamResponse );
				} );

				req.params = { id: teamId };

				investmentService.getSectorTeam.and.callFake( () => promise );

				controller.sectorTeam( req, res );

				promise.then( () => {

					expect( investmentService.getSectorTeam ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/sector-teams/detail', { dateRange: sectorTeamResponse.date_range, team: sectorTeamResponse.results } );
					done();
				} );
			} );
		} );

		describe( 'With a failure', function(){

			it( 'Should call render error', function( done ){

				const teamId = '1';
				const err = new Error( 'some error' );
				let rejectPromise;

				const promise = new Promise( ( resolve, reject ) => {
					rejectPromise = reject;
				} );

				req.params = { id: teamId };

				investmentService.getSectorTeam.and.callFake( () => promise );

				controller.sectorTeam( req, res );

				expect( createHandler ).toHaveBeenCalledWith( res );

				rejectPromise( err );

				setTimeout( () => {

					expect( investmentService.getSectorTeam ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );

} );
