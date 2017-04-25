const proxyquire = require( 'proxyquire' );

const backendService = require( '../../../../app/lib/service/service.backend' );
const errorHandler = require( '../../../../app/lib/render-error' );
const sectorSummary = require( '../../../../app/lib/view-models/sector-summary' );
const hvcSummary = require( '../../../../app/lib/view-models/sector-hvc-summary' );
const hvcTargetPerformance = require( '../../../../app/lib/view-models/hvc-target-performance' );
const monthlyPerformance = require( '../../../../app/lib/view-models/monthly-performance' );

const interceptBackend = require( '../../helpers/intercept-backend' );
const createErrorHandler = require( '../../helpers/create-error-handler' );

const year = 2017;
let controller;

describe( 'HVC Groups controller', function(){

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
			'../lib/view-models/monthly-performance': monthlyPerformance
		};

		controller = proxyquire( '../../../../app/controllers/controller.hvc-groups', stubs );
	} );

	describe( 'List', function(){

		it( 'Should get the list data and render the correct view', function( done ){

			spyOn( backendService, 'getHvcGroups' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callFake( createErrorHandler( done ) );

			const req = {
				alice: '87654',
				year
			};

			interceptBackend.getStub( `/mi/hvc_groups/?year=${ year }`, 200, '/hvc_groups/' );

			controller.list( req, { render: function( view, data ){

				expect( backendService.getHvcGroups ).toHaveBeenCalledWith( req );
				expect( view ).toEqual( 'hvc-groups/list.html' );
				expect( data.hvcGroups ).toBeDefined();
				expect( data.hvcGroups.length ).toBeGreaterThan( 1 );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} } );
		} );
	} );

	describe( 'Group', function(){

		it( 'Should get the group data and render the correct view', function( done ){

			spyOn( backendService, 'getHvcGroupInfo' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callFake( createErrorHandler( done ) );
			spyOn( sectorSummary, 'create' ).and.callThrough();
			spyOn( hvcSummary, 'create' ).and.callThrough();
			spyOn( hvcTargetPerformance, 'create' ).and.callThrough();
			spyOn( monthlyPerformance, 'create' ).and.callThrough();

			const req = {
				alice: '1234',
				year,
				params: {
					id: 1234
				}
			};
			const groupId = req.params.id;

			interceptBackend.getStub( `/mi/hvc_groups/${ groupId }/?year=${ year }`, 200, '/hvc_groups/group' );
			interceptBackend.getStub( `/mi/hvc_groups/${ groupId }/months/?year=${ year }`, 200, '/hvc_groups/months' );
			interceptBackend.getStub( `/mi/hvc_groups/${ groupId }/campaigns/?year=${ year }`, 200, '/hvc_groups/campaigns' );

			controller.group( req, { render: function( view, data ){

				expect( data.summary.dateRange ).toBeDefined();

				expect( backendService.getHvcGroupInfo ).toHaveBeenCalledWith( req, groupId );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( sectorSummary.create ).toHaveBeenCalled();
				expect( hvcSummary.create ).toHaveBeenCalled();
				expect( hvcTargetPerformance.create ).toHaveBeenCalled();
				expect( monthlyPerformance.create ).toHaveBeenCalled();

				expect( data.sectorName ).toBeDefined();
				expect( data.summary ).toBeDefined();
				expect( data.hvcSummary ).toBeDefined();
				expect( data.hvcTargetPerformance ).toBeDefined();
				expect( data.monthlyPerformance ).toBeDefined();

				expect( view ).toEqual( 'hvc-groups/detail.html' );
				done();
			} } );
		} );
	} );
} );
