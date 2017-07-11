const proxyquire = require( 'proxyquire' );

const createErrorHandler = require( '../../helpers/create-error-handler' );
const getBackendStub = require( '../../helpers/get-backend-stub' );
const spy = require( '../../helpers/spy' );

let res;
let viewModel;
let errorHandler;

let hvcDetail;
let topMarkets;
let backendService;
let topMaketsModel;

let controller;

describe( 'HVC controller', function(){

	beforeEach( function(){

		backendService = {};
		viewModel = {};
		topMaketsModel = { test: 1 };

		hvcDetail = {
			create: spy( 'view-models.hvc-detail.create', viewModel )
		};
		topMarkets = {
			create: spy( 'view-models.top-markets.create', topMaketsModel )
		};
		res = {
			render: spy( 'res.render' )
		};
		errorHandler = {
			createHandler: spy( 'createHandler' )
		};

		controller = proxyquire( '../../../../app/controllers/controller.hvc', {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../lib/view-models/hvc-detail': hvcDetail,
			'../lib/view-models/top-markets': topMarkets
		} );
	} );

	describe( 'Detail', function(){

		it( 'Should get the HVC data and render the correct view', function( done ){

			const hvcData = getBackendStub( '/hvc/hvc' );
			const hvcMarkets = getBackendStub( '/hvc/markets' );
			const hvcId = 1234;
			const req = {
				params: {
					id: hvcId
				}
			};

			let promise = new Promise( ( resolve ) => {

				resolve( { hvc: hvcData, markets: hvcMarkets } );
			} );

			backendService.getHvcInfo = spy( 'getHvcInfo', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.hvc( req, res );

			promise.then( function(){

				expect( backendService.getHvcInfo ).toHaveBeenCalledWith( req, hvcId );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( hvcDetail.create ).toHaveBeenCalledWith( hvcData );
				expect( topMarkets.create ).toHaveBeenCalledWith( hvcMarkets );

				expect( res.render ).toHaveBeenCalledWith( 'hvc/detail.html', viewModel );
				expect( viewModel.topMarkets ).toEqual( topMaketsModel );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} );
		} );
	} );
} );
