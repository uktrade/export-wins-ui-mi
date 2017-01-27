const transform = require( '../../../../../app/lib/transformers/sector' );
const sectorTeamInput = require( '../../../../../stubs/backend/sector_teams/sector_team_v2' );
const overseasRegionInput = require( '../../../../../stubs/backend/os_regions/region' );

describe( 'Sector transformer', function(){

	let output;

	describe( 'With a sector team', function(){
		
		beforeEach( function(){
		
			output = transform( sectorTeamInput );
		} );
	
		it( 'Should calculate the total confirmed', function(){
		
			expect( output.exportValue ).toEqual( 228975262 );
		} );
	} );

	describe( 'With an overseas region', function(){
		
		beforeEach( function(){
		
			output = transform( overseasRegionInput );
		} );
	
		it( 'Should calculate the total confirmed', function(){
		
			expect( output.exportValue ).toEqual( 280236070 );
		} );
	} );
} );
