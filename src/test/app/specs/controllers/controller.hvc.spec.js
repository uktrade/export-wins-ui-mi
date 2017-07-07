const proxyquire = require( 'proxyquire' );

const createErrorHandler = require( '../../helpers/create-error-handler' );
const getBackendStub = require( '../../helpers/get-backend-stub' );

let controller;
let hvcDetail;
let topMarkets;
let res;
let errorHandler;
let backendService;
const viewModel = {};
const topMaketsModel = { test: 1 };

describe( 'HVC controller', function(){

	let oldTimeout;

	beforeEach( function(){

		oldTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
	} );

	afterEach( function(){

		jasmine.DEFAULT_TIMEOUT_INTERVAL = oldTimeout;
	} );

	beforeEach( function(){

		hvcDetail = {
			create: jasmine.createSpy( 'view-models.hvc-detail.create' ).and.callFake( () => viewModel )
		};
		topMarkets = {
			create: jasmine.createSpy( 'view-models.top-markets.create' ).and.callFake( () => topMaketsModel )
		};
		res = {
			render: jasmine.createSpy( 'res.render' )
		};
		errorHandler = {
			createHandler: jasmine.createSpy( 'createHandler' )
		};
		backendService = {
			getHvcInfo: jasmine.createSpy( 'getHvcInfo' )
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

			backendService.getHvcInfo.and.callFake( () => promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.hvc( req, res );

			promise.then( function(){

				expect( backendService.getHvcInfo ).toHaveBeenCalledWith( req, hvcId );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( hvcDetail.create ).toHaveBeenCalledWith( hvcData );
				expect( topMarkets.create ).toHaveBeenCalledWith( hvcMarkets );

				expect( res.render.calls.argsFor( 0 )[ 0 ] ).toEqual( 'hvc/detail.html' );
				expect( res.render.calls.argsFor( 0 )[ 1 ] ).toEqual( viewModel );
				expect( viewModel.topMarkets ).toEqual( topMaketsModel );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} );
		} );
	} );
} );
