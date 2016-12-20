const backendStub = require( '../../../../app/lib/backend.stub' );

const topNonHvcStub = require( '../../../../stubs/backend/top_non_hvc_2016-12-12' );
const campaignsStub = require( '../../../../stubs/backend/sector_team_campaigns_2016-12-12' );
const monthsStub = require( '../../../../stubs/backend/sector_team_months_2016-12-12' );
const sectorStub = require( '../../../../stubs/backend/sector_team_v2' );
const sectorsStub = require( '../../../../stubs/backend/sector_teams' );

const regionTopNonHvcStub = require( '../../../../stubs/backend/region_top_non_hvc' );
const regionCampaignsStub = require( '../../../../stubs/backend/region_campaigns' );
const regionMonthsStub = require( '../../../../stubs/backend/region_months' );
const regionStub = require( '../../../../stubs/backend/region' );

describe( 'Backend stub', function(){

	function checkStub( url, stub, done ){

		backendStub.get( url, ( err, response, data ) => {

			expect( err ).toBeNull();
			expect( response.statusCode ).toEqual( 200 );
			expect( data ).toEqual( stub );
			done();
		} );
	}

	describe( 'Sectors', function(){
	
		describe( 'Getting the top non hvc regions and sectors', function(){
		
			it( 'Should return the top_non_hvc stub', function( done ){

				const url = '/mi/sector_teams/2/top_non_hvcs/';

				checkStub( url, topNonHvcStub, done );
			} );
		} );

		describe( 'Getting campaigns', function(){

			it( 'Should return the campaigns stub', function( done ){
			
				const url = '/mi/sector_teams/1/campaigns/';
				
				checkStub( url, campaignsStub, done );
			} );
		} );

		describe( 'Getting months', function(){
		
			it( 'Should return the months stub', function( done ){
		
				const url = '/mi/sector_teams/3/months/';

				checkStub( url, monthsStub, done );
			} );
		} );

		describe( 'Getting sector', function(){
		
			it( 'Should return the sector stub', function( done ){
		
				const url = '/mi/sector_teams/3/';

				checkStub( url, sectorStub, done );
			} );
		} );

		describe( 'Getting the sector list', function(){
		
			it( 'Should return the stub', function( done ){
		
				const url = '/mi/sector_teams/';

				checkStub( url, sectorsStub, done );
			} );
		} );
	} );


	describe( 'Regions', function(){
	
		describe( 'Getting the top non hvc', function(){
		
			it( 'Should return the top_non_hvc stub', function( done ){
		
				const url = '/mi/regions/2/top_non_hvcs/';

				checkStub( url, regionTopNonHvcStub, done );
			} );
		} );

		describe( 'Getting campaigns', function(){
		
			it( 'Should return the campaigns stub', function( done ){
		
				const url = '/mi/regions/3/campaigns/';

				checkStub( url, regionCampaignsStub, done );
			} );
		} );

		describe( 'Getting months', function(){
		
			it( 'Should return the months stub', function( done ){
		
				const url = '/mi/regions/3/months/';

				checkStub( url, regionMonthsStub, done );
			} );
		} );

		describe( 'Getting region', function(){
		
			it( 'Should return the region stub', function( done ){
		
				const url = '/mi/regions/3/';

				checkStub( url, regionStub, done );
			} );
		} );		
	} );
} );
