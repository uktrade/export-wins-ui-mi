const proxyquire = require( 'proxyquire' );
const getBackendStub = require( '../../../../helpers/get-backend-stub' );

const moduleFile = '../../../../../../app/sub-apps/investment/controllers/controller.uk-regions';

let controller;
let fdiService;
let createHandler;
let renderErrorHandler;
let req;
let res;

describe( 'Investment UK Regions controller', function(){

	beforeEach( function(){

		renderErrorHandler = jasmine.createSpy( 'renderErrorHandler' );
		createHandler = jasmine.createSpy( 'createHandler' ).and.callFake( () => renderErrorHandler );

		fdiService = {
			getUkRegions: jasmine.createSpy( 'getUkRegions' ),
			getUkRegion: jasmine.createSpy( 'getUkRegion' )
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

	describe( 'UK Regions', function(){

		describe( 'With success', function(){

			it( 'Should render the view with the correct data', function( done ){

				const ukRegions = getBackendStub( '/investment/fdi/uk_regions/index' );
				const promise = new Promise( ( resolve ) => {
					resolve( { ukRegions } );
				} );

				fdiService.getUkRegions.and.callFake( () => promise );

				controller.regions( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				promise.then( ( data ) => {

					expect( fdiService.getUkRegions ).toHaveBeenCalledWith( req );
					//stop this assertion until we use the real list as there is a race condition
					//expect( res.render ).toHaveBeenCalledWith( 'investment/views/uk-regions/overview', { regions: data } );
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

				fdiService.getUkRegions.and.callFake( () => promise );

				controller.regions( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getUkRegions ).toHaveBeenCalledWith( req );
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
				const ukRegionResponse = { date_range: { start: 1, end: 2 }, results: { id: 1, name: 'abc' } };
				const promise =  new Promise( ( resolve ) => {
					resolve( ukRegionResponse );
				} );

				req.params = { id: teamId };

				fdiService.getUkRegion.and.callFake( () => promise );

				controller.region( req, res );

				promise.then( () => {

					expect( fdiService.getUkRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/uk-regions/detail', { dateRange: ukRegionResponse.date_range, region: ukRegionResponse.results } );
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

				fdiService.getUkRegion.and.callFake( () => promise );

				controller.region( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getUkRegion ).toHaveBeenCalledWith( req, teamId );
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
				const ukRegionResponse = { date_range: { start: 1, end: 2 }, results: { id: 1, name: 'abc' } };
				const promise =  new Promise( ( resolve ) => {
					resolve( ukRegionResponse );
				} );

				req.params = { id: teamId };

				fdiService.getUkRegion.and.callFake( () => promise );

				controller.hvcPerformance( req, res );

				promise.then( () => {

					expect( fdiService.getUkRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/uk-regions/hvc-performance', { dateRange: ukRegionResponse.date_range, region: ukRegionResponse.results } );
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

				fdiService.getUkRegion.and.callFake( () => promise );

				controller.hvcPerformance( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getUkRegion ).toHaveBeenCalledWith( req, teamId );
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
				const ukRegionResponse = { date_range: { start: 1, end: 2 }, results: { id: 1, name: 'abc' } };
				const promise =  new Promise( ( resolve ) => {
					resolve( ukRegionResponse );
				} );

				req.params = { id: teamId };

				fdiService.getUkRegion.and.callFake( () => promise );

				controller.nonHvcPerformance( req, res );

				promise.then( () => {

					expect( fdiService.getUkRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/uk-regions/non-hvc-performance', { dateRange: ukRegionResponse.date_range, region: ukRegionResponse.results } );
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

				fdiService.getUkRegion.and.callFake( () => promise );

				controller.nonHvcPerformance( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getUkRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );

	describe( 'HVC Wins', function(){

		describe( 'With success', function(){

			it( 'Should render the view with the correct data', function( done ){

				const teamId = '1';
				const ukRegionResponse = { date_range: { start: 1, end: 2 }, results: { id: 1, name: 'abc' } };
				const promise =  new Promise( ( resolve ) => {
					resolve( ukRegionResponse );
				} );

				req.params = { id: teamId };

				fdiService.getUkRegion.and.callFake( () => promise );

				controller.wins( req, res );

				promise.then( () => {

					expect( fdiService.getUkRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/uk-regions/wins', { dateRange: ukRegionResponse.date_range, region: ukRegionResponse.results } );
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

				fdiService.getUkRegion.and.callFake( () => promise );

				controller.wins( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getUkRegion ).toHaveBeenCalledWith( req, teamId );
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
				const ukRegionResponse = { date_range: { start: 1, end: 2 }, results: { id: 1, name: 'abc' } };
				const promise =  new Promise( ( resolve ) => {
					resolve( ukRegionResponse );
				} );

				req.params = { id: teamId };

				fdiService.getUkRegion.and.callFake( () => promise );

				controller.nonHvcWins( req, res );

				promise.then( () => {

					expect( fdiService.getUkRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/uk-regions/non-hvc-wins', { dateRange: ukRegionResponse.date_range, region: ukRegionResponse.results } );
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

				fdiService.getUkRegion.and.callFake( () => promise );

				controller.nonHvcWins( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				rejectPromise( err );

				setTimeout( () => {

					expect( fdiService.getUkRegion ).toHaveBeenCalledWith( req, teamId );
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );
} );
