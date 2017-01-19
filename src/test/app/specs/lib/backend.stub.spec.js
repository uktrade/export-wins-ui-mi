const backendStub = require( '../../../../app/lib/backend.stub' );

const sectorsOverviewStub = require( '../../../../stubs/backend/sector_teams/overview' );
const sectorTeamsTopNonHvcStub = require( '../../../../stubs/backend/sector_teams/top_non_hvcs' );
const sectorTeamsCampaignsStub = require( '../../../../stubs/backend/sector_teams/campaigns' );
const sectorTeamMonthsStub = require( '../../../../stubs/backend/sector_teams/months_2016-12-12' );
const sectorTeamStub = require( '../../../../stubs/backend/sector_teams/sector_team_v2' );
const sectorTeamsStub = require( '../../../../stubs/backend/sector_teams/' );

const overseasRegionTopNonHvcStub = require( '../../../../stubs/backend/os_regions/top_non_hvcs' );
const overseasRegionCampaignsStub = require( '../../../../stubs/backend/os_regions/campaigns' );
const overseasRegionMonthsStub = require( '../../../../stubs/backend/os_regions/months' );
const overseasRegionStub = require( '../../../../stubs/backend/os_regions/region' );
const overseasRegionsStub = require( '../../../../stubs/backend/os_regions/' );
const overseasRegionsOverviewStub = require( '../../../../stubs/backend/os_regions/overview' );

const parentSectorsStub = require( '../../../../stubs/backend/parent_sectors' );
const parentSectorStub = require( '../../../../stubs/backend/parent_sector' );
const parentCampaignsStub = require( '../../../../stubs/backend/parent_sector_campaigns' );
const parentMonthsStub = require( '../../../../stubs/backend/parent_sector_months' );
const parentTopNonHvcsStub = require( '../../../../stubs/backend/parent_sector_top_non_hvcs' );


describe( 'Backend stub', function(){

	function checkStub( url, stub, done ){

		backendStub.get( 'fake-alice-str', url, ( err, response, data ) => {

			expect( err ).toBeNull();
			expect( response.statusCode ).toEqual( 200 );
			expect( data ).toEqual( stub );
			done();
		} );
	}

	describe( 'Sectors', function(){

		describe( 'Getting the overview', function(){
		
			it( 'Should return the overview stub', function( done ){
			
				const url = '/mi/sector_teams/overview/';

				checkStub( url, sectorsOverviewStub, done );
			} );
		} );
	
		describe( 'Getting the top non hvc regions and sectors', function(){
		
			it( 'Should return the top_non_hvc stub', function( done ){

				const url = '/mi/sector_teams/2/top_non_hvcs/';

				checkStub( url, sectorTeamsTopNonHvcStub, done );
			} );
		} );

		describe( 'Getting campaigns', function(){

			it( 'Should return the campaigns stub', function( done ){
			
				const url = '/mi/sector_teams/1/campaigns/';
				
				checkStub( url, sectorTeamsCampaignsStub, done );
			} );
		} );

		describe( 'Getting months', function(){
		
			it( 'Should return the months stub', function( done ){
		
				const url = '/mi/sector_teams/3/months/';

				checkStub( url, sectorTeamMonthsStub, done );
			} );
		} );

		describe( 'Getting sector', function(){
		
			it( 'Should return the sector stub', function( done ){
		
				const url = '/mi/sector_teams/3/';

				checkStub( url, sectorTeamStub, done );
			} );
		} );

		describe( 'Getting the sector list', function(){
		
			it( 'Should return the stub', function( done ){
		
				const url = '/mi/sector_teams/';

				checkStub( url, sectorTeamsStub, done );
			} );
		} );
	} );


	describe( 'Overseas Regions', function(){

		describe( 'Getting the regions list', function(){
		
			it( 'Should return the list', function( done ){
		
				const url = '/mi/os_regions/';

				checkStub( url, overseasRegionsStub, done );
			} );
		} );
	
		describe( 'Getting the top non hvc', function(){
		
			it( 'Should return the top_non_hvc stub', function( done ){
		
				const url = '/mi/os_regions/2/top_non_hvcs/';

				checkStub( url, overseasRegionTopNonHvcStub, done );
			} );
		} );

		describe( 'Getting campaigns', function(){
		
			it( 'Should return the campaigns stub', function( done ){
		
				const url = '/mi/os_regions/3/campaigns/';

				checkStub( url, overseasRegionCampaignsStub, done );
			} );
		} );

		describe( 'Getting months', function(){
		
			it( 'Should return the months stub', function( done ){
		
				const url = '/mi/os_regions/3/months/';

				checkStub( url, overseasRegionMonthsStub, done );
			} );
		} );

		describe( 'Getting a region', function(){
		
			it( 'Should return the region stub', function( done ){
		
				const url = '/mi/os_regions/3/';

				checkStub( url, overseasRegionStub, done );
			} );
		} );	

		describe( 'Getting the overview', function(){
			
				it( 'Should return the overview', function( done ){
			
					const url = '/mi/os_regions/overview/';

					checkStub( url, overseasRegionsOverviewStub, done );
				} );
			} );	
	} );

	describe( 'Parent sectors', function(){
	
		describe( 'Getting the list of parent sectors', function(){
		
			it( 'Should return the list', function( done ){
			
				const url = '/mi/parent_sectors/';

				checkStub( url, parentSectorsStub, done );
			} );
		} );

		describe( 'Getting a parent sector sector', function(){
		
			it( 'Should return the sector info', function( done ){
		
				const url = '/mi/parent_sectors/3/';

				checkStub( url, parentSectorStub, done );
			} );
		} );

		describe( 'Getting the campaigns', function(){
		
			it( 'Should return the campaigns', function( done ){
		
				const url = '/mi/parent_sectors/3/campaigns/';

				checkStub( url, parentCampaignsStub, done );
			} );
		} );

		describe( 'Getting the months', function(){
		
			it( 'Should return the month info', function( done ){
		
				const url = '/mi/parent_sectors/3/months/';

				checkStub( url, parentMonthsStub, done );
			} );
		} );

		describe( 'Getting the top non hvcs', function(){
		
			it( 'Should return the top non hvcs info', function( done ){
		
				const url = '/mi/parent_sectors/3/top_non_hvcs/';

				checkStub( url, parentTopNonHvcsStub, done );
			} );
		} );
	} );
} );
