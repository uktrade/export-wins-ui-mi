const proxyquire = require( 'proxyquire' );

const moduleFile = '../../../../../../app/sub-apps/investment/controllers/controller.index';

let controller;
let investmentService;
let getHomepageData;
let req;
let res;

describe( 'Index controller', function(){

	beforeEach( function(){

		getHomepageData = jasmine.createSpy( 'getHomepageData' );

		investmentService = { getHomepageData };

		controller = proxyquire( moduleFile, {
			'../../../lib/service/service.backend/investment': investmentService
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
				const promise =  new Promise( ( resolve ) => {
					resolve( { sectorTeams } );
				} );

				getHomepageData.and.callFake( () => promise );

				controller( req, res );

				promise.then( () => {

					expect( getHomepageData ).toHaveBeenCalledWith( req );
					expect( res.render ).toHaveBeenCalledWith( 'investment/views/index', { sectorTeams } );
					done();
				} );
			} );
		} );

		describe( 'With a failure', function(){

			it( 'Should call render error', function(){


			} );
		} );
	} );
} );
