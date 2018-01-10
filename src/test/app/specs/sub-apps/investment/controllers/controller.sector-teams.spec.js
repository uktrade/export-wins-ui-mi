const proxyquire = require( 'proxyquire' );

const moduleFile = '../../../../../../app/sub-apps/investment/controllers/controller.sector-teams';

let controller;
let fdiService;
let createHandler;
let renderErrorHandler;
let fdiOverviewViewModelSpy;
let fdiSectorTeamMarketsViewModelSpy;
let sortProjectsSpy;
let req;
let res;

describe( 'Investment Sector Teams controller', function(){

	beforeEach( function(){

		fdiOverviewViewModelSpy = jasmine.createSpy( 'fdiOverviewViewModel' );
		fdiSectorTeamMarketsViewModelSpy = jasmine.createSpy( 'fdiSectorTeamMarketsViewModel' );
		sortProjectsSpy = jasmine.createSpy( 'sortProjects' );

		renderErrorHandler = jasmine.createSpy( 'renderErrorHandler' );
		createHandler = jasmine.createSpy( 'createHandler' ).and.callFake( () => renderErrorHandler );

		fdiService = {
			getSectorTeamsOverview: jasmine.createSpy( 'getSectorTeamsOverview' ),
			getSectorTeam: jasmine.createSpy( 'getSectorTeam' ),
			getSectorTeamHvc: jasmine.createSpy( 'getSectorTeamHvc' ),
			getSectorTeamNonHvc: jasmine.createSpy( 'getSectorTeamNonHvc' ),
			getSectorTeamWinTable: jasmine.createSpy( 'getSectorTeamWinTable' ),
			getSectorTeamHvcWinTable: jasmine.createSpy( 'getSectorTeamHvcWinTable' ),
			getSectorTeamNonHvcWinTable: jasmine.createSpy( 'getSectorTeamNonHvcWinTable' )
		};

		controller = proxyquire( moduleFile, {
			'../../../lib/service/service.backend/investment/fdi': fdiService,
			'../../../lib/render-error': { createHandler },
			'../view-models/fdi-overview': { create: fdiOverviewViewModelSpy },
			'../view-models/fdi-sector-team-markets': { create: fdiSectorTeamMarketsViewModelSpy },
			'../lib/sort-projects': sortProjectsSpy
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

				const fdiOverviewViewModelResponse = { fdiOverviewViewModelResponse: true };
				const fdiSectorTeamMarketsViewModelResponse = { fdiSectorTeamMarketsViewModelResponse: true };
				const overviewResponse = { date_range: { start: 1, end: 2 }, results: { overview: { sectorTeamsOverview: true }, sector_teams: { sectorTeamsList: true } } };
				const promise = new Promise( ( resolve ) => { resolve( overviewResponse );	} );

				fdiService.getSectorTeamsOverview.and.callFake( () => promise );
				fdiOverviewViewModelSpy.and.callFake( () => fdiOverviewViewModelResponse );
				fdiSectorTeamMarketsViewModelSpy.and.callFake( () => fdiSectorTeamMarketsViewModelResponse );

				controller.sectorTeams( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				promise.then( () => {

					expect( fdiService.getSectorTeamsOverview ).toHaveBeenCalledWith( req );
					expect( fdiOverviewViewModelSpy ).toHaveBeenCalledWith( overviewResponse.results.overview );
					expect( fdiSectorTeamMarketsViewModelSpy ).toHaveBeenCalledWith( overviewResponse.results.sector_teams );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/sector-teams/overview', {
						teams: overviewResponse,
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

				fdiService.getSectorTeamsOverview.and.callFake( () => promise );

				controller.sectorTeams( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getSectorTeamsOverview ).toHaveBeenCalledWith( req );
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

	describe( 'HVC Projects', function(){

		let sortProjectsResponse;

		beforeEach( function(){

			sortProjectsResponse = { sortProjectsResponse: true };
			sortProjectsSpy.and.callFake( () => sortProjectsResponse );
		} );

		describe( 'With success', function(){

			it( 'Should render the view with the correct data', function( done ){

				const teamId = '1';
				const projectsResponse = {
					date_range: { start: 1, end: 2 },
					results: {
						name: 'a name',
						description: 'a description',
						investments: {
							hvc: { hvc_projects: true },
							non_hvc: { non_hvc_project: true }
						}
					}
				};
				const promise =  new Promise( ( resolve ) => {
					resolve( projectsResponse );
				} );

				req.params = { id: teamId };
				req.query.sort = { key: 'test', dir: 'asc' };

				fdiService.getSectorTeamHvcWinTable.and.callFake( () => promise );

				controller.hvcProjects( req, res );

				promise.then( () => {

					expect( fdiService.getSectorTeamHvcWinTable ).toHaveBeenCalledWith( req, teamId );
					expect( sortProjectsSpy ).toHaveBeenCalledWith( projectsResponse.results.investments, req.query.sort );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/sector-teams/hvc-projects', {
						dateRange: projectsResponse.date_range,
						team: {
							id: teamId,
							name: projectsResponse.results.name,
							description: projectsResponse.results.description
						},
						projects: sortProjectsResponse
					} );
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

				fdiService.getSectorTeamHvcWinTable.and.callFake( () => promise );

				controller.hvcProjects( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getSectorTeamHvcWinTable ).toHaveBeenCalledWith( req, teamId );
					expect( sortProjectsSpy ).not.toHaveBeenCalled();
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );

	describe( 'Non HVC Projects', function(){

		let sortProjectsResponse;

		beforeEach( function(){

			sortProjectsResponse = { sortProjectsResponse: true };
			sortProjectsSpy.and.callFake( () => sortProjectsResponse );
		} );

		describe( 'With success', function(){

			it( 'Should render the view with the correct data', function( done ){

				const teamId = '1';
				const projectsResponse = {
					date_range: { start: 1, end: 2 },
					results: {
						name: 'a name',
						description: 'a description',
						investments: {
							hvc: { hvc_projects: true },
							non_hvc: { non_hvc_project: true }
						}
					}
				};
				const promise =  new Promise( ( resolve ) => {
					resolve( projectsResponse );
				} );

				req.params = { id: teamId };
				req.query.sort = { key: 'testing', dir: 'asc' };

				fdiService.getSectorTeamNonHvcWinTable.and.callFake( () => promise );

				controller.nonHvcProjects( req, res );

				promise.then( () => {

					expect( fdiService.getSectorTeamNonHvcWinTable ).toHaveBeenCalledWith( req, teamId );
					expect( sortProjectsSpy ).toHaveBeenCalledWith( projectsResponse.results.investments, req.query.sort );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/sector-teams/non-hvc-projects', {
						dateRange: projectsResponse.date_range,
						team: {
							id: teamId,
							name: projectsResponse.results.name,
							description: projectsResponse.results.description
						},
						projects: sortProjectsResponse
					} );
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

				fdiService.getSectorTeamNonHvcWinTable.and.callFake( () => promise );

				controller.nonHvcProjects( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getSectorTeamNonHvcWinTable ).toHaveBeenCalledWith( req, teamId );
					expect( sortProjectsSpy ).not.toHaveBeenCalled();
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );
} );
