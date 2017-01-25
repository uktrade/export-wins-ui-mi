const transform = require( '../../../../../app/lib/transformers/sector-team' );
const sectorTeamInput = require( '../../../../../stubs/backend/sector_teams/sector_team_v2' );

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
} );
