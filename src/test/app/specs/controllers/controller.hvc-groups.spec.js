const proxyquire = require( 'proxyquire' );
const backendService = require( '../../../../app/lib/service/service.backend' );
const errorHandler = require( '../../../../app/lib/render-error' );
const interceptBackend = require( '../../helpers/intercept-backend' );

let controller;

describe( 'Overseas Regions controller', function(){

	beforeEach( function(){

		const stubs = {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler
		};

		controller = proxyquire( '../../../../app/controllers/controller.hvc-groups', stubs );
	} );

	describe( 'List', function(){
	
		it( 'Should get the list data and render the correct view', function( done ){
		
			spyOn( backendService, 'getHvcGroups' ).and.callThrough();
			spyOn( errorHandler, 'createHandler' ).and.callThrough();

			const req = {
				alice: '87654'
			};

			interceptBackend.getStub( '/mi/hvc_groups/', 200, '/hvc_groups/' );

			controller.list( req, { render: function( view, data ){

				expect( backendService.getHvcGroups ).toHaveBeenCalledWith( req.alice );
				expect( view ).toEqual( 'hvc-groups/list.html' );
				expect( data.hvcGroups ).toBeDefined();
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} } );
		} );
	} );

	describe( 'Group', function(){
	
		it( 'Should get the group data and render the correct view', function( done ){
	
			spyOn( backendService, 'getHvcGroupInfo' ).and.callThrough();

			const req = {
				alice: '1234',
				params: {
					id: 1234
				}
			};
			const groupId = req.params.id;

			interceptBackend.getStub( `/mi/hvc_groups/${ groupId }/`, 200, '/hvc_groups/group' );
			interceptBackend.getStub( `/mi/hvc_groups/${ groupId }/months/`, 200, '/hvc_groups/months' );
			interceptBackend.getStub( `/mi/hvc_groups/${ groupId }/campaigns/`, 200, '/hvc_groups/campaigns' );

			controller.group( req, { render: function( view, data ){

				expect( backendService.getHvcGroupInfo ).toHaveBeenCalledWith( req.alice, groupId );
				expect( view ).toEqual( 'hvc-groups/detail.html' );
				expect( data.sectorPerformance ).toBeDefined();
				expect( data.winSummary ).toBeDefined();
				expect( data.sectorName ).toBeDefined();
				expect( data.hvcTargetPerformance ).toBeDefined();
				done();
			} } );
		} );
	} );
} );
