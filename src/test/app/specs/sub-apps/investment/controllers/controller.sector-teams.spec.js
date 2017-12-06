const proxyquire = require( 'proxyquire' );

const moduleFile = '../../../../../../app/sub-apps/investment/controllers/controller.sector-teams';

let controller;
let fdiService;
let createHandler;
let renderErrorHandler;
let fdiOverviewViewModelSpy;
let fdiSectorTeamMarketsViewModelSpy;
let req;
let res;

describe( 'Investment Sector Teams controller', function(){

	beforeEach( function(){

		fdiOverviewViewModelSpy = jasmine.createSpy( 'fdiOverviewViewModel' );
		fdiSectorTeamMarketsViewModelSpy = jasmine.createSpy( 'fdiSectorTeamMarketsViewModel' );

		renderErrorHandler = jasmine.createSpy( 'renderErrorHandler' );
		createHandler = jasmine.createSpy( 'createHandler' ).and.callFake( () => renderErrorHandler );

		fdiService = {
			getSectorTeams: jasmine.createSpy( 'getSectorTeams' ),
			getSectorTeam: jasmine.createSpy( 'getSectorTeam' ),
			getSectorTeamHvc: jasmine.createSpy( 'getSectorTeamHvc' ),
			getSectorTeamNonHvc: jasmine.createSpy( 'getSectorTeamNonHvc' )
		};

		controller = proxyquire( moduleFile, {
			'../../../lib/service/service.backend/investment/fdi': fdiService,
			'../../../lib/render-error': { createHandler },
			'../view-models/fdi-overview': { create: fdiOverviewViewModelSpy },
			'../view-models/fdi-sector-team-markets': { create: fdiSectorTeamMarketsViewModelSpy }
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

				const sectorTeams = { date_range: { start: 1, end: 2 }, results: true };
				const promise = new Promise( ( resolve ) => {
					resolve( sectorTeams );
				} );

				fdiService.getSectorTeams.and.callFake( () => promise );

				controller.sectorTeams( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				promise.then( () => {

					expect( fdiService.getSectorTeams ).toHaveBeenCalledWith( req );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/sector-teams/overview', {
						sectorTeams
					} );
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

				fdiService.getSectorTeams.and.callFake( () => promise );

				controller.sectorTeams( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getSectorTeams ).toHaveBeenCalledWith( req );
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );

	describe( 'Sector Team Performance', function(){

		let teamId;
		let fdiOverviewViewModelResponse;
		let fdiSectorTeamMarketsViewModelResponse;
		let sectorTeamResponse;
		let promise;

		beforeEach( function(){

			teamId = '1';
			fdiOverviewViewModelResponse = { fdiOverviewViewModelResponse: true };
			fdiSectorTeamMarketsViewModelResponse = { fdiSectorTeamMarketsViewModelResponse: true };
			sectorTeamResponse = {
				date_range: { start: 1, end: 2 },
				results: {
					id: 1,
					name: 'abc',
					overview: { someData: true },
					market:{ marketData: true }
				}
			};
			promise =  new Promise( ( resolve ) => resolve( sectorTeamResponse ) );

			req.params = { id: teamId };
			fdiOverviewViewModelSpy.and.callFake( () => fdiOverviewViewModelResponse );
			fdiSectorTeamMarketsViewModelSpy.and.callFake( () => fdiSectorTeamMarketsViewModelResponse );
		} );

		describe( 'Single Sector Team', function(){

			describe( 'With success', function(){

				it( 'Should render the view with the correct data', function( done ){

					fdiService.getSectorTeam.and.callFake( () => promise );

					controller.sectorTeam( req, res );

					promise.then( () => {

						expect( fdiService.getSectorTeam ).toHaveBeenCalledWith( req, teamId );
						expect( fdiOverviewViewModelSpy ).toHaveBeenCalledWith( sectorTeamResponse.results.overview );
						expect( fdiSectorTeamMarketsViewModelSpy ).toHaveBeenCalledWith( sectorTeamResponse.results.markets );
						expect( res.render ).toHaveBeenCalledWith( 'investment/views/sector-teams/detail', {
							dateRange: sectorTeamResponse.date_range,
							teamId,
							team: sectorTeamResponse.results,
							overview: fdiOverviewViewModelResponse,
							markets: fdiSectorTeamMarketsViewModelResponse
						} );
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

					fdiService.getSectorTeam.and.callFake( () => promise );

					controller.sectorTeam( req, res );

					expect( createHandler ).toHaveBeenCalledWith( req, res );

					rejectPromise( err );

					setTimeout( () => {

						expect( fdiService.getSectorTeam ).toHaveBeenCalledWith( req, teamId );
						expect( res.render ).not.toHaveBeenCalled();
						expect( renderErrorHandler ).toHaveBeenCalledWith( err );
						done();
					}, 1 );
				} );
			} );
		} );

		describe( 'HVC Performance', function(){

			describe( 'With success', function(){

				it( 'Should render the view with the correct data', function( done ){

					fdiService.getSectorTeamHvc.and.callFake( () => promise );

					controller.hvcPerformance( req, res );

					promise.then( () => {

						expect( fdiService.getSectorTeamHvc ).toHaveBeenCalledWith( req, teamId );
						expect( fdiOverviewViewModelSpy ).toHaveBeenCalledWith( sectorTeamResponse.results.overview );
						expect( fdiSectorTeamMarketsViewModelSpy ).toHaveBeenCalledWith( sectorTeamResponse.results.markets );
						expect( res.render ).toHaveBeenCalledWith( 'investment/views/sector-teams/hvc-performance', {
							dateRange: sectorTeamResponse.date_range,
							teamId,
							team: sectorTeamResponse.results,
							overview: fdiOverviewViewModelResponse,
							markets: fdiSectorTeamMarketsViewModelResponse
						} );
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

					fdiService.getSectorTeamHvc.and.callFake( () => promise );

					controller.hvcPerformance( req, res );

					expect( createHandler ).toHaveBeenCalledWith( req, res );

					rejectPromise( err );

					setTimeout( () => {

						expect( fdiService.getSectorTeamHvc ).toHaveBeenCalledWith( req, teamId );
						expect( res.render ).not.toHaveBeenCalled();
						expect( renderErrorHandler ).toHaveBeenCalledWith( err );
						done();
					}, 1 );
				} );
			} );
		} );

		describe( 'Non HVC Performance', function(){

			describe( 'With success', function(){

				it( 'Should render the view with the correct data', function( done ){

					fdiService.getSectorTeamNonHvc.and.callFake( () => promise );

					controller.nonHvcPerformance( req, res );

					promise.then( () => {

						expect( fdiService.getSectorTeamNonHvc ).toHaveBeenCalledWith( req, teamId );
						expect( fdiOverviewViewModelSpy ).toHaveBeenCalledWith( sectorTeamResponse.results.overview );
						expect( fdiSectorTeamMarketsViewModelSpy ).toHaveBeenCalledWith( sectorTeamResponse.results.markets );
						expect( res.render ).toHaveBeenCalledWith( 'investment/views/sector-teams/non-hvc-performance', {
							dateRange: sectorTeamResponse.date_range,
							teamId,
							team: sectorTeamResponse.results,
							overview: fdiOverviewViewModelResponse,
							markets: fdiSectorTeamMarketsViewModelResponse
						} );
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

					fdiService.getSectorTeamNonHvc.and.callFake( () => promise );

					controller.nonHvcPerformance( req, res );

					expect( createHandler ).toHaveBeenCalledWith( req, res );

					rejectPromise( err );

					setTimeout( () => {

						expect( fdiService.getSectorTeamNonHvc ).toHaveBeenCalledWith( req, teamId );
						expect( res.render ).not.toHaveBeenCalled();
						expect( renderErrorHandler ).toHaveBeenCalledWith( err );
						done();
					}, 1 );
				} );
			} );
		} );
	} );

	describe( 'HVC Wins', function(){

		describe( 'With success', function(){

			it( 'Should render the view with the correct data', function( done ){

				const teamId = '1';
				const sectorTeamResponse = { date_range: { start: 1, end: 2 }, results: { id: 1, name: 'abc' } };
				const promise =  new Promise( ( resolve ) => {
					resolve( sectorTeamResponse );
				} );

				req.params = { id: teamId };

				fdiService.getSectorTeam.and.callFake( () => promise );

				controller.wins( req, res );

				promise.then( () => {

					expect( fdiService.getSectorTeam ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/sector-teams/wins', { dateRange: sectorTeamResponse.date_range, teamId, team: sectorTeamResponse.results } );
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

				fdiService.getSectorTeam.and.callFake( () => promise );

				controller.wins( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getSectorTeam ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );

	describe( 'Non HVC wins', function(){

		describe( 'With success', function(){

			it( 'Should render the view with the correct data', function( done ){

				const teamId = '1';
				const sectorTeamResponse = { date_range: { start: 1, end: 2 }, results: { id: 1, name: 'abc' } };
				const promise =  new Promise( ( resolve ) => {
					resolve( sectorTeamResponse );
				} );

				req.params = { id: teamId };

				fdiService.getSectorTeam.and.callFake( () => promise );

				controller.nonHvcWins( req, res );

				promise.then( () => {

					expect( fdiService.getSectorTeam ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/sector-teams/non-hvc-wins', { dateRange: sectorTeamResponse.date_range, teamId, team: sectorTeamResponse.results } );
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

				fdiService.getSectorTeam.and.callFake( () => promise );

				controller.nonHvcWins( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getSectorTeam ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );
} );
