const proxyquire = require( 'proxyquire' );

const moduleFile = '../../../../../../app/sub-apps/investment/controllers/controller.index';

let controller;
let fdiService;
let getHomepageData;
let createHandler;
let renderErrorHandler;
let overviewViewModelSpy;
let req;
let res;

describe( 'Index controller', function(){

	beforeEach( function(){

		getHomepageData = jasmine.createSpy( 'getHomepageData' );
		overviewViewModelSpy = jasmine.createSpy( 'overviewViewModel' );

		renderErrorHandler = jasmine.createSpy( 'renderErrorHandler' );
		createHandler = jasmine.createSpy( 'createHandler' ).and.callFake( () => renderErrorHandler );

		fdiService = { getHomepageData };

		controller = proxyquire( moduleFile, {
			'../../../lib/service/service.backend/investment/fdi': fdiService,
			'../../../lib/render-error': { createHandler },
			'../view-models/fdi-overview': { create: overviewViewModelSpy }
		} );

		req = {
			cookies: { sessionid: '456' },
			query: {},
			year: 2017
		};

		res = {
			render: jasmine.createSpy( 'res.render' )
		};
	} );

	describe( 'Handler', function(){

		describe( 'With success', function(){

			function check( req, showSectorTeams, done ){

				const overviewResponse = { overviewResponse: true };
				const overviewData = { date_range: { overviewDataDateRange: true }, results: { somedata: true } };
				const overviewYoy = { overviewYoy: true };
				const sectorTeams = { sectorTeams: true };
				const overseasRegions = { overseasRegions: true };
				const promise =  new Promise( ( resolve ) => {
					resolve( {
						overview: overviewData,
						overviewYoy,
						sectorTeams,
						overseasRegions
					} );
				} );

				getHomepageData.and.callFake( () => promise );
				overviewViewModelSpy.and.callFake( () => overviewResponse );

				controller( req, res );

				promise.then( () => {

					expect( getHomepageData ).toHaveBeenCalledWith( req );
					expect( overviewViewModelSpy ).toHaveBeenCalledWith( overviewData.results );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/index', {

						dateRange: overviewData.date_range,
						overview: overviewResponse,
						overviewYoy,
						sectorTeams,
						overseasRegions,
						showSectorTeams
					} );
					done();
				} );
			}

			describe( 'Without a feature flag', function(){

				it( 'Should render the view without the sector teams list', function( done ){

					check( req, false, done );
				} );
			} );

			describe( 'With a feature flag', function(){

				it( 'Should render the view with the sector teams list', function( done ){

					req.query.sectorteams = '1';

					check( req, true, done );
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

				getHomepageData.and.callFake( () => promise );

				controller( req, res );

				expect( createHandler ).toHaveBeenCalledWith( res );

				rejectPromise( err );

				setTimeout( () => {

					expect( getHomepageData ).toHaveBeenCalledWith( req );
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );
} );
