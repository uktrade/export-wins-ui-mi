const transform = require( '../../../../../app/lib/transformers/sector-team' );
const input = require( '../../../../../stubs/backend/sector_team_v2' );

describe( 'Sector team transformer', function(){

	let output;

	beforeEach( function(){
	
		output = transform( input );
	} );

	it( 'Should calculate the total confirmed', function(){
	
		expect( output.exportValue ).toEqual( 228975262 );
	} );
} );
