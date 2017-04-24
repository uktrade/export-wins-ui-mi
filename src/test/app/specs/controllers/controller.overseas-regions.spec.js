const proxyquire = require( 'proxyquire' );

const backendService = require( '../../../../app/lib/service/service.backend' );
const errorHandler = require( '../../../../app/lib/render-error' );
const sectorSummary = require( '../../../../app/lib/view-models/sector-summary' );
const hvcSummary = require( '../../../../app/lib/view-models/sector-hvc-summary' );
const hvcTargetPerformance = require( '../../../../app/lib/view-models/hvc-target-performance' );
const topMarkets = require( '../../../../app/lib/view-models/top-markets' );
const monthlyPerformance = require( '../../../../app/lib/view-models/monthly-performance' );

const interceptBackend = require( '../../helpers/intercept-backend' );
const createErrorHandler = require( '../../helpers/create-error-handler' );

const year = 2017;
let controller;

describe( 'Overseas Regions controller', function(){

	let oldTimeout;

	beforeEach( function(){

		oldTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
	} );

	afterEach( function(){

		jasmine.DEFAULT_TIMEOUT_INTERVAL = oldTimeout;
	} );

	beforeEach( function(){

		const stubs = {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../lib/view-models/sector-summary': sectorSummary,
			'../lib/view-models/sector-hvc-summary': hvcSummary,
			'../lib/view-models/hvc-target-performance': hvcTargetPerformance,
			'../lib/view-models/top-markets': topMarkets,
			'../lib/view-models/monthly-performance': monthlyPerformance
		};

		controller = proxyquire( '../../../../app/controllers/controller.overseas-regions', stubs );
	} );

	describe( 'Overview', function(){

		it( 'Should get the overview data and render the correct view', function( done ){

			const req = {
				alice: '123',
				year
			};

			spyOn( backendService, 'getOverseasRegionsOverview' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callFake( createErrorHandler( done ) );

			interceptBackend.getStub( `/mi/os_regions/overview/?year=${ req.year }`, 200, '/os_regions/overview' );

			controller.overview( req, { render: function( view, data ){

				expect( backendService.getOverseasRegionsOverview ).toHaveBeenCalledWith( req.alice, req.year );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( data.dateRange ).toBeDefined();
				expect( data.regionGroups ).toBeDefined();
				expect( data.regionGroups.length ).toBeGreaterThan( 1 );
				expect( view ).toEqual( 'overseas-regions/overview.html' );
				done();
			} } );
		} );
	} );

	describe( 'List', function(){

		it( 'Should get the list data and render the correct view', function( done ){

			const req = {
				alice: '87654',
				year
			};

			spyOn( backendService, 'getOverseasRegions' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callFake( createErrorHandler( done ) );

			interceptBackend.getStub( `/mi/os_regions/?year=${ req.year }`, 200, '/os_regions/' );

			controller.list( req, { render: function( view, data ){

				expect( backendService.getOverseasRegions ).toHaveBeenCalledWith( req.alice, req.year );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( view ).toEqual( 'overseas-regions/list.html' );
				expect( data.regions ).toBeDefined();
				expect( data.regions.length ).toBeGreaterThan( 1 );
				done();
			} } );
		} );
	} );

	describe( 'Region', function(){

		it( 'Should get the region data and render the correct view', function( done ){

			const req = {
				alice: '1234',
				year,
				params: {
					id: 1234
				}
			};

			const regionId = req.params.id;

			spyOn( backendService, 'getOverseasRegionInfo' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callFake( createErrorHandler( done ) );
			spyOn( sectorSummary, 'create' ).and.callThrough();
			spyOn( hvcSummary, 'create' ).and.callThrough();
			spyOn( hvcTargetPerformance, 'create' ).and.callThrough();
			spyOn( topMarkets, 'create' ).and.callThrough();
			spyOn( monthlyPerformance, 'create' ).and.callThrough();

			interceptBackend.getStub( `/mi/os_regions/${ regionId }/?year=${ req.year }`, 200, '/os_regions/region' );
			interceptBackend.getStub( `/mi/os_regions/${ regionId }/months/?year=${ req.year }`, 200, '/os_regions/months' );
			interceptBackend.getStub( `/mi/os_regions/${ regionId }/campaigns/?year=${ req.year }`, 200, '/os_regions/campaigns' );
			interceptBackend.getStub( `/mi/os_regions/${ regionId }/top_non_hvcs/?year=${ req.year }`, 200, '/os_regions/top_non_hvcs' );

			controller.region( req, { render: function( view, data ){

				expect( backendService.getOverseasRegionInfo ).toHaveBeenCalledWith( req.alice, req.year, regionId );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( sectorSummary.create ).toHaveBeenCalled();
				expect( hvcSummary.create ).toHaveBeenCalled();
				expect( hvcTargetPerformance.create ).toHaveBeenCalled();
				expect( topMarkets.create ).toHaveBeenCalled();
				expect( monthlyPerformance.create ).toHaveBeenCalled();

				expect( data.regionName ).toBeDefined();
				expect( data.summary ).toBeDefined();
				expect( data.hvcSummary ).toBeDefined();
				expect( data.hvcTargetPerformance ).toBeDefined();
				expect( data.monthlyPerformance ).toBeDefined();
				expect( data.topMarkets ).toBeDefined();

				expect( view ).toEqual( 'overseas-regions/detail.html' );
				done();
			} } );
		} );
	} );
} );
