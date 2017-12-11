const proxyquire = require( 'proxyquire' );

const moduleFile = '../../../../../../app/sub-apps/investment/controllers/controller.overseas-regions';

let controller;
let fdiService;
let createHandler;
let renderErrorHandler;
let req;
let res;

describe( 'Investment Overseas Regions controller', function(){

	beforeEach( function(){

		renderErrorHandler = jasmine.createSpy( 'renderErrorHandler' );
		createHandler = jasmine.createSpy( 'createHandler' ).and.callFake( () => renderErrorHandler );

		fdiService = {
			getOverseasRegions: jasmine.createSpy( 'getOverseasRegions' ),
			getOverseasRegion: jasmine.createSpy( 'getOverseasRegion' )
		};

		controller = proxyquire( moduleFile, {
			'../../../lib/service/service.backend/investment/fdi': fdiService,
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

	describe( 'Overseas Regions', function(){

		describe( 'With success', function(){

			it( 'Should render the view with the correct data', function( done ){

				const osRegions = { osRegions: true };
				const promise = new Promise( ( resolve ) => {
					resolve( { osRegions } );
				} );

				fdiService.getOverseasRegions.and.callFake( () => promise );

				controller.regions( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				promise.then( ( data ) => {

					expect( fdiService.getOverseasRegions ).toHaveBeenCalledWith( req );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/overseas-regions/overview', { regions: data } );
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

				fdiService.getOverseasRegions.and.callFake( () => promise );

				controller.regions( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getOverseasRegions ).toHaveBeenCalledWith( req );
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );

	describe( 'Overseas Region', function(){

		describe( 'With success', function(){

			it( 'Should render the view with the correct data', function( done ){

				const teamId = '1';
				const osRegionResponse = { date_range: { start: 1, end: 2 }, results: { id: 1, name: 'abc' } };
				const promise =  new Promise( ( resolve ) => {
					resolve( osRegionResponse );
				} );

				req.params = { id: teamId };

				fdiService.getOverseasRegion.and.callFake( () => promise );

				controller.region( req, res );

				promise.then( () => {

					expect( fdiService.getOverseasRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/overseas-regions/detail', { dateRange: osRegionResponse.date_range, region: osRegionResponse.results } );
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

				fdiService.getOverseasRegion.and.callFake( () => promise );

				controller.region( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getOverseasRegion ).toHaveBeenCalledWith( req, teamId );
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

				const teamId = '1';
				const osRegionResponse = { date_range: { start: 1, end: 2 }, results: { id: 1, name: 'abc' } };
				const promise =  new Promise( ( resolve ) => {
					resolve( osRegionResponse );
				} );

				req.params = { id: teamId };

				fdiService.getOverseasRegion.and.callFake( () => promise );

				controller.hvcPerformance( req, res );

				promise.then( () => {

					expect( fdiService.getOverseasRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/overseas-regions/hvc-performance', { dateRange: osRegionResponse.date_range, region: osRegionResponse.results } );
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

				fdiService.getOverseasRegion.and.callFake( () => promise );

				controller.hvcPerformance( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getOverseasRegion ).toHaveBeenCalledWith( req, teamId );
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

				const teamId = '1';
				const osRegionResponse = { date_range: { start: 1, end: 2 }, results: { id: 1, name: 'abc' } };
				const promise =  new Promise( ( resolve ) => {
					resolve( osRegionResponse );
				} );

				req.params = { id: teamId };

				fdiService.getOverseasRegion.and.callFake( () => promise );

				controller.nonHvcPerformance( req, res );

				promise.then( () => {

					expect( fdiService.getOverseasRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/overseas-regions/non-hvc-performance', { dateRange: osRegionResponse.date_range, region: osRegionResponse.results } );
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

				fdiService.getOverseasRegion.and.callFake( () => promise );

				controller.nonHvcPerformance( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getOverseasRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );

	describe( 'HVC projects', function(){

		describe( 'With success', function(){

			it( 'Should render the view with the correct data', function( done ){

				const teamId = '1';
				const osRegionResponse = { date_range: { start: 1, end: 2 }, results: { id: 1, name: 'abc' } };
				const promise =  new Promise( ( resolve ) => {
					resolve( osRegionResponse );
				} );

				req.params = { id: teamId };

				fdiService.getOverseasRegion.and.callFake( () => promise );

				controller.hvcProjects( req, res );

				promise.then( () => {

					expect( fdiService.getOverseasRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/overseas-regions/hvc-projects', { dateRange: osRegionResponse.date_range, region: osRegionResponse.results } );
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

				fdiService.getOverseasRegion.and.callFake( () => promise );

				controller.hvcProjects( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getOverseasRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );

	describe( 'Non HVC projects', function(){

		describe( 'With success', function(){

			it( 'Should render the view with the correct data', function( done ){

				const teamId = '1';
				const osRegionResponse = { date_range: { start: 1, end: 2 }, results: { id: 1, name: 'abc' } };
				const promise =  new Promise( ( resolve ) => {
					resolve( osRegionResponse );
				} );

				req.params = { id: teamId };

				fdiService.getOverseasRegion.and.callFake( () => promise );

				controller.nonHvcProjects( req, res );

				promise.then( () => {

					expect( fdiService.getOverseasRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/overseas-regions/non-hvc-projects', { dateRange: osRegionResponse.date_range, region: osRegionResponse.results } );
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

				fdiService.getOverseasRegion.and.callFake( () => promise );

				controller.nonHvcProjects( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getOverseasRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );
} );
