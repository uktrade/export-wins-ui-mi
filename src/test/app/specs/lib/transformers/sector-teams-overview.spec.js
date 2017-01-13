const transform = require( '../../../../../app/lib/transformers/sector-teams-overview' );
const input = require( '../../../../../stubs/backend/sector_teams_overview' );

describe( 'Sector teams overview transformer', function(){

	let output;

	beforeEach( function(){
	
		output = transform( input );
	} );

	it( 'Should add the images', function(){
	
		for( let team of output ){

			expect( team.image.name ).toBeDefined();
			expect( team.image.width ).toBeDefined();
			expect( team.image.height ).toBeDefined();
		}
	} );

	it( 'Should give the sector teams the correct properties', function(){
	
		for( let team of output ){

			expect( team.name ).toBeDefined();
			expect( team.hvcColours ).toBeDefined();
			expect( team.parentSectors ).toBeDefined();
			expect( team.value.percentage ).toBeDefined();
			expect( team.value.current ).toBeDefined();
			expect( team.value.target ).toBeDefined();
			expect( team.hvcVsNonhvcPercentage ).toBeDefined();
		}
	} );

	it( 'Should give the parent sectors the correct properties', function(){
	
		for( let team of output ){

			for( let parent of team.parentSectors ){

				expect( parent.name ).toBeDefined();
				expect( parent.hvcColours ).toBeDefined();
				expect( parent.value.percentage ).toBeDefined();
				expect( parent.value.current ).toBeDefined();
				expect( parent.value.target ).toBeDefined();
				expect( parent.hvcVsNonhvcPercentage ).toBeDefined();
			}
		}
	} );
} );
