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
			year: 2017,
			user: {}
		};

		res = {
			render: jasmine.createSpy( 'res.render' )
		};
	} );

	describe( 'Handler', function(){

		describe( 'With success', function(){

			function check( req, done, opts ){

				const {
					showSectorTeams = false,
					showOverseasRegions = false,
					showUkRegions = false
				} = opts;

				const overviewResponse = { overviewResponse: true };
				const overviewData = { date_range: { overviewDataDateRange: true }, results: { somedata: true } };
				const overviewYoy = { overviewYoy: true };
				const sectorTeams = { sectorTeams: true };
				const overseasRegions = { overseasRegions: true };
				const ukRegions = { ukRegions: true };
				const promise =  new Promise( ( resolve ) => {
					resolve( {
						overview: overviewData,
						overviewYoy,
						sectorTeams,
						overseasRegions,
						ukRegions
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
						ukRegions,
						showSectorTeams,
						showOverseasRegions,
						showUkRegions
					} );
					done();
				} );
			}

			describe( 'with experiments ON', function(){

				it( 'Should render the view with the sector teams and os regions lists', function( done ){

					req.user.experiments = true;

					check( req, done, { showSectorTeams: true, showOverseasRegions: true, showUkRegions: true } );
				} );
			} );

			describe( 'with experiments OFF', function(){

				it( 'Should render the view without the sector teams or os regions lists', function( done ){

					check( req, done, {} );
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
