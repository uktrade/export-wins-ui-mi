const proxyquire = require( 'proxyquire' );

const moduleFile = '../../../../../../app/sub-apps/investment/controllers/controller.index';

let controller;
let investmentService;
let getHomepageData;
let createHandler;
let renderErrorHandler;
let req;
let res;

describe( 'Index controller', function(){

	beforeEach( function(){

		getHomepageData = jasmine.createSpy( 'getHomepageData' );

		renderErrorHandler = jasmine.createSpy( 'renderErrorHandler' );
		createHandler = jasmine.createSpy( 'createHandler' ).and.callFake( () => renderErrorHandler );

		investmentService = { getHomepageData };

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
			render: jasmine.createSpy( 'res.render' )
		};
	} );

	describe( 'Handler', function(){

		describe( 'With success', function(){

			it( 'Should render the view with the correct data', function( done ){

				const sectorTeams = { sectorTeams: true };
				const overseasRegions = { overseasRegions: true };
				const promise =  new Promise( ( resolve ) => {
					resolve( { sectorTeams, overseasRegions } );
				} );

				getHomepageData.and.callFake( () => promise );

				controller( req, res );

				promise.then( () => {

					expect( getHomepageData ).toHaveBeenCalledWith( req );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/index', { sectorTeams, overseasRegions } );
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
