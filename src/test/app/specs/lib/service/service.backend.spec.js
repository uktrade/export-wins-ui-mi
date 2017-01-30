const proxyquire = require( 'proxyquire' );

const configStub = { backend: { stub: true } };

let alice = 'test';
let stubs;
let backend;
let monthsSpy;
let campaignsSpy;
let sectorSpy;
let sectorTeamsOverviewSpy;
let osRegionsOverviewSpy;
let hvcGroupSpy;

const hvcGroups = require( '../../../../../stubs/backend/hvc_groups' );

describe( 'Backend service', function(){

	beforeEach( function(){

		monthsSpy = jasmine.createSpy( 'months' );
		campaignsSpy = jasmine.createSpy( 'campaigns' );
		sectorSpy = jasmine.createSpy( 'sector' );
		sectorTeamsOverviewSpy = jasmine.createSpy( 'sector-teams-overview' );
		osRegionsOverviewSpy = jasmine.createSpy( 'os-regions-overview' );
		hvcGroupSpy = jasmine.createSpy( 'hvc-group' );

		stubs = {
			'../../config': configStub,
			'../logger': require( '../../../helpers/mock-logger' ),
			'../transformers/months': monthsSpy,
			'../transformers/campaigns': campaignsSpy,
			'../transformers/sector': sectorSpy,
			'../transformers/sector-teams-overview': sectorTeamsOverviewSpy,
			'../transformers/os-regions-overview': osRegionsOverviewSpy,
			'../transformers/hvc-group': hvcGroupSpy
		};

		backend = proxyquire( '../../../../../app/lib/service/service.backend', stubs );
	} );

	describe( 'Getting the sector team', function(){
	
		it( 'Should use the sector transformer', function( done ){
	
			backend.getSectorTeam( alice, '3' ).then( () => {

				expect( sectorSpy ).toHaveBeenCalled();
				expect( sectorSpy.calls.count() ).toEqual( 1 );
				done();
			} );
		} );
	} );

	describe( 'Getting the sector team months', function(){
	
		it( 'Should use the months transformer', function( done ){
	
			backend.getSectorTeamMonths( alice, '3' ).then( () => {

				expect( monthsSpy ).toHaveBeenCalled();
				expect( monthsSpy.calls.count() ).toEqual( 1 );
				done();
			} );
		} );
	} );

	describe( 'Getting the sector team campaigns', function(){
	
		it( 'Should use the campaigns transformer', function( done ){
	
			backend.getSectorTeamCampaigns( alice, '3' ).then( () => {

				expect( campaignsSpy ).toHaveBeenCalled();
				expect( campaignsSpy.calls.count() ).toEqual( 1 );
				done();
			} );
		} );
	} );
	
	describe( 'Getting the sector team overview', function(){
	
		it( 'Should use the sector teams overview transformer', function( done ){
	
			backend.getSectorTeamsOverview( alice, '3' ).then( () => {

				expect( sectorTeamsOverviewSpy ).toHaveBeenCalled();
				expect( sectorTeamsOverviewSpy.calls.count() ).toEqual( 1 );
				done();
			} );
		} );
	} );

	describe( 'Getting the overseas region', function(){
	
		it( 'Should use the sector transformer', function( done ){
	
			backend.getOverseasRegion( alice, '3' ).then( () => {

				expect( sectorSpy ).toHaveBeenCalled();
				expect( sectorSpy.calls.count() ).toEqual( 1 );
				done();
			} );
		} );
	} );

	describe( 'Getting the overseas regions months', function(){
	
		it( 'Should use the months transformer', function( done ){
	
			backend.getOverseasRegionMonths( alice, '3' ).then( () => {

				expect( monthsSpy ).toHaveBeenCalled();
				expect( monthsSpy.calls.count() ).toEqual( 1 );
				done();
			} );
		} );
	} );

	describe( 'Getting the overseas regions campaigns', function(){
	
		it( 'Should use the campaigns transformer', function( done ){
	
			backend.getOverseasRegionCampaigns( alice, '3' ).then( () => {

				expect( campaignsSpy ).toHaveBeenCalled();
				expect( campaignsSpy.calls.count() ).toEqual( 1 );
				done();
			} );
		} );
	} );

	describe( 'Getting the overseas regions overview', function(){
	
		it( 'Should use the overseas regions overview transformer', function( done ){
	
			backend.getOverseasRegionsOverview( alice, '3' ).then( () => {

				expect( osRegionsOverviewSpy ).toHaveBeenCalled();
				expect( osRegionsOverviewSpy.calls.count() ).toEqual( 1 );
				done();
			} );
		} );
	} );

	describe( 'Getting the region name', function(){
	
		it( 'Should return the correct name', function( done ){
		
			backend.getOverseasRegionName( 'test', 1 ).then( ( name ) => {

				expect( name ).toEqual( 'North Africa' );
				done();
				
			} ).catch( ( err ) => { expect( err ).not.toBeDefined(); done(); } );
		} );
	} );

	describe( 'Getting the list of HVC Groups', function(){
	
		it( 'Should return just the hvc groups', function( done ){
	
			backend.getHvcGroups().then( ( hvcGroup ) => {

				expect( hvcGroup ).toEqual( hvcGroups );
				done();
			} );
		} );
	} );

	describe( 'Getting an hvc group', function(){
	
		it( 'Should use the hvc group transformer', function( done ){
	
			backend.getHvcGroup( alice, '3' ).then( () => {

				expect( hvcGroupSpy ).toHaveBeenCalled();
				expect( hvcGroupSpy.calls.count() ).toEqual( 1 );
				done();
			} );
		} );
	} );

	describe( 'Getting an hvc group campaigns', function(){
	
		it( 'Should use the campaigns transformer', function( done ){
	
			backend.getHvcGroupCampaigns( alice, '3' ).then( () => {

				expect( campaignsSpy ).toHaveBeenCalled();
				expect( campaignsSpy.calls.count() ).toEqual( 1 );
				done();	
			} );
		} );
	} );

	describe( 'Getting an hvc group months', function(){
	
		it( 'Should use the months transformer', function( done ){
	
			backend.getHvcGroupMonths( alice, '3' ).then( () => {

				expect( monthsSpy ).toHaveBeenCalled();
				expect( monthsSpy.calls.count() ).toEqual( 1 );
				done();
			} );
		} );
	} );
} );
