const proxyquire = require( 'proxyquire' );

const moduleFile = '../../../../../../app/sub-apps/investment/controllers/controller.index';

let controller;
let fdiService;
let getHomepageData;
let createHandler;
let renderErrorHandler;
let performanceHeadlinesViewModelSpy;
let performanceDetailsViewModelSpy;
let req;
let res;

describe( 'Index controller', function(){

	beforeEach( function(){

		getHomepageData = jasmine.createSpy( 'getHomepageData' );
		performanceHeadlinesViewModelSpy = jasmine.createSpy( 'performanceHeadlinesViewModel' );
		performanceDetailsViewModelSpy = jasmine.createSpy( 'performanceDetailsViewModel' );

		renderErrorHandler = jasmine.createSpy( 'renderErrorHandler' );
		createHandler = jasmine.createSpy( 'createHandler' ).and.callFake( () => renderErrorHandler );

		fdiService = { getHomepageData };

		controller = proxyquire( moduleFile, {
			'../../../lib/service/service.backend/investment/fdi': fdiService,
			'../../../lib/render-error': { createHandler },
			'../view-models/fdi-performance-headlines': { create: performanceHeadlinesViewModelSpy },
			'../view-models/fdi-performance-details': { create: performanceDetailsViewModelSpy }
		} );

		req = {
			cookies: { sessionid: '456' },
			query: {},
			year: 2017,
			user: {}
		};

		res = {
			render: jasmine.createSpy( 'res.render' )
		};
	} );

	describe( 'Handler', function(){

		describe( 'With success', function(){

			it( 'Should render the view', function( done ){

				const performanceHeadlinesResponse = { performanceHeadlinesResponse: true };
				const performanceDetailsResponse = { performanceDetailsResponse: true };
				const performanceData = { date_range: { performanceDataDateRange: true }, results: { somedata: true } };
				const sectorsData = { date_range: { sectorsDataDateRange: true }, results: { someSectorsData: true } };

				const promise =  new Promise( ( resolve ) => {
					resolve( {
						performance: performanceData,
						sectors: sectorsData
					} );
				} );

				getHomepageData.and.callFake( () => promise );
				performanceHeadlinesViewModelSpy.and.callFake( () => performanceHeadlinesResponse );
				performanceDetailsViewModelSpy.and.callFake( () => performanceDetailsResponse );

				controller( req, res );

				promise.then( () => {

					expect( getHomepageData ).toHaveBeenCalledWith( req );
					expect( performanceHeadlinesViewModelSpy ).toHaveBeenCalledWith( performanceData.results );
					expect( performanceDetailsViewModelSpy ).toHaveBeenCalledWith( performanceData.results );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/index', {

						dateRange: performanceData.date_range,
						headlines: performanceHeadlinesResponse,
						details: performanceDetailsResponse,
						sectors: sectorsData.results
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

				getHomepageData.and.callFake( () => promise );

				controller( req, res );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

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
