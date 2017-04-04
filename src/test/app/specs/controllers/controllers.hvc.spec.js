const proxyquire = require( 'proxyquire' );

const backendService = require( '../../../../app/lib/service/service.backend' );
const errorHandler = require( '../../../../app/lib/render-error' );
const hvcTargetPerformance = require( '../../../../app/lib/view-models/hvc-target-performance' );
const topMarkets = require( '../../../../app/lib/view-models/top-markets' );
const monthlyPerformance = require( '../../../../app/lib/view-models/monthly-performance' );

let controller;

describe( 'HVC controller', function(){

	beforeEach( function(){

		const stubs = {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../lib/view-models/hvc-target-performance': hvcTargetPerformance,
			'../lib/view-models/top-markets': topMarkets,
			'../lib/view-models/monthly-performance': monthlyPerformance
		};

		controller = proxyquire( '../../../../app/controllers/controller.hvc', stubs );
	} );

	describe( 'Detail', function(){
	
		it( 'Should get the HVC data and render the correct view', function( done ){
	
			const req = {
				alice: '1234',
				params: {
					id: 1234
				}
			};

			const hvcId = req.params.id;

			spyOn( backendService, 'getHvc' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callThrough();
			spyOn( hvcTargetPerformance, 'create' ).and.callThrough();
			spyOn( topMarkets, 'create' ).and.callThrough();
			spyOn( monthlyPerformance, 'create' ).and.callThrough();

			controller.hvc( req, { render: function( view, data ){

				expect( backendService.getHvc ).toHaveBeenCalledWith( req.alice, hvcId );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( hvcTargetPerformance.create ).toHaveBeenCalled();
				expect( topMarkets.create ).toHaveBeenCalled();
				expect( monthlyPerformance.create ).toHaveBeenCalled();
				
				expect( data.id ).toBeDefined();
				expect( data.name ).toBeDefined();
				expect( data.hvcSummary ).toBeDefined();
				expect( data.hvcTargetPerformance ).toBeDefined();
				expect( data.monthlyPerformance ).toBeDefined();
				expect( data.topMarkets ).toBeDefined();

				expect( view ).toEqual( 'hvc/detail.html' );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} } );
		} );
	} );
} );
