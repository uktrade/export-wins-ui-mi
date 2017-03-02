const transform = require( '../../../../../app/lib/transformers/sector' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const sectorTeamInput = getBackendStub( '/sector_teams/sector_team' );
const overseasRegionInput = getBackendStub( '/os_regions/region' );

describe( 'Sector transformer', function(){

	let output;

	describe( 'With a sector team', function(){
		
		beforeEach( function(){
		
			output = transform( sectorTeamInput );
		} );
	
		it( 'Should return the total confirmed', function(){
		
			expect( output.exportValue ).toEqual( 130082 );
		} );

		it( 'Should return the total including unconfirmed', function(){
		
			expect( output.exportValueTotal ).toEqual( 197175 );
		} );
	} );

	describe( 'With an overseas region', function(){
		
		beforeEach( function(){
		
			output = transform( overseasRegionInput );
		} );
	
		it( 'Should return the total confirmed', function(){
		
			expect( output.exportValue ).toEqual( 56203 );
		} );

		it( 'Should return the total including unconfirmed', function(){
		
			expect( output.exportValueTotal ).toEqual( 156339 );
		} );
	} );
} );
