/*
const proxyquire = require( 'proxyquire' );

const moduleFile = '../../../../../../app/sub-apps/investment/controllers/controller.sector-teams';

let controller;
let fdiService;
let createHandler;
let renderErrorHandler;
let sortProjectsSpy;
let req;
let res;

describe( 'Investment Sector Teams controller', function(){

	beforeEach( function(){

		sortProjectsSpy = jasmine.createSpy( 'sortProjects' );

		renderErrorHandler = jasmine.createSpy( 'renderErrorHandler' );
		createHandler = jasmine.createSpy( 'createHandler' ).and.callFake( () => renderErrorHandler );

		fdiService = {
			getSectorTeamWinTable: jasmine.createSpy( 'getSectorTeamWinTable' ),
			getSectorTeamHvcWinTable: jasmine.createSpy( 'getSectorTeamHvcWinTable' ),
			getSectorTeamNonHvcWinTable: jasmine.createSpy( 'getSectorTeamNonHvcWinTable' )
		};

		controller = proxyquire( moduleFile, {
			'../../../lib/service/service.backend/investment/fdi': fdiService,
			'../../../lib/render-error': { createHandler },
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
*/
