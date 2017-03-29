const proxyquire = require( 'proxyquire' );

const backendService = require( '../../../../app/lib/service/service.backend' );
const errorHandler = require( '../../../../app/lib/render-error' );
const sectorSummary = require( '../../../../app/lib/view-models/sector-summary' );
const hvcSummary = require( '../../../../app/lib/view-models/sector-hvc-summary' );
const hvcTargetPerformance = require( '../../../../app/lib/view-models/hvc-target-performance' );
const topMarkets = require( '../../../../app/lib/view-models/top-markets' );

const interceptBackend = require( '../../helpers/intercept-backend' );


let controller;

describe( 'Overseas Regions controller', function(){

	beforeEach( function(){

		const stubs = {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../lib/view-models/sector-summary': sectorSummary,
			'../lib/view-models/sector-hvc-summary': hvcSummary,
			'../lib/view-models/hvc-target-performance': hvcTargetPerformance,
			'../lib/view-models/top-markets': topMarkets
		};

		controller = proxyquire( '../../../../app/controllers/controller.overseas-regions', stubs );
	} );

	describe( 'Overview', function(){
	
		it( 'Should get the overview data and render the correct view', function( done ){

			const req = {
				alice: '123'
			};

			spyOn( backendService, 'getOverseasRegionsOverview' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callThrough();

			interceptBackend.getStub( '/mi/os_regions/overview/', 200, '/os_regions/overview' );

			controller.overview( req, { render: function( view, data ){

				expect( backendService.getOverseasRegionsOverview ).toHaveBeenCalledWith( req.alice );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( data.regionGroups ).toBeDefined();
				expect( view ).toEqual( 'overseas-regions/overview.html' );
				done();
			} } );
		} );
	} );

	describe( 'List', function(){
	
		it( 'Should get the list data and render the correct view', function( done ){
		
			const req = {
				alice: '87654'
			};

			spyOn( backendService, 'getOverseasRegions' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callThrough();

			interceptBackend.getStub( '/mi/os_regions/', 200, '/os_regions/' );

			controller.list( req, { render: function( view, data ){

				expect( backendService.getOverseasRegions ).toHaveBeenCalledWith( req.alice );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( view ).toEqual( 'overseas-regions/list.html' );
				expect( data.regions ).toBeDefined();
				done();
			} } );
		} );
	} );

	describe( 'Region', function(){
	
		it( 'Should get the region data and render the correct view', function( done ){
	
			const req = {
				alice: '1234',
				params: {
					id: 1234
				}
			};

			const regionId = req.params.id;

			spyOn( backendService, 'getOverseasRegionInfo' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callThrough();
			spyOn( sectorSummary, 'create' ).and.callThrough();
			spyOn( hvcSummary, 'create' ).and.callThrough();
			spyOn( hvcTargetPerformance, 'create' ).and.callThrough();
			spyOn( topMarkets, 'create' ).and.callThrough();

			interceptBackend.getStub( `/mi/os_regions/${ regionId }/`, 200, '/os_regions/region' );
			interceptBackend.getStub( `/mi/os_regions/${ regionId }/months/`, 200, '/os_regions/months' );
			interceptBackend.getStub( `/mi/os_regions/${ regionId }/campaigns/`, 200, '/os_regions/campaigns' );
			interceptBackend.getStub( `/mi/os_regions/${ regionId }/top_non_hvcs/`, 200, '/os_regions/top_non_hvcs' );

			controller.region( req, { render: function( view, data ){

				expect( backendService.getOverseasRegionInfo ).toHaveBeenCalledWith( req.alice, regionId );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( sectorSummary.create ).toHaveBeenCalled();
				expect( hvcSummary.create ).toHaveBeenCalled();
				expect( hvcTargetPerformance.create ).toHaveBeenCalled();
				expect( topMarkets.create ).toHaveBeenCalled();

				expect( data.regionName ).toBeDefined();
				expect( data.summary ).toBeDefined();
				expect( data.hvcSummary ).toBeDefined();
				expect( data.hvcTargetPerformance ).toBeDefined();
				expect( data.sectorPerformance ).toBeDefined();
				expect( data.topMarkets ).toBeDefined();

				expect( view ).toEqual( 'overseas-regions/detail.html' );
				done();
			} } );
		} );
	} );
} );
