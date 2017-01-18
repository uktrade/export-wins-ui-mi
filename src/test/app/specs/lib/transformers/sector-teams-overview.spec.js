const transform = require( '../../../../../app/lib/transformers/sector-teams-overview' );
const input = require( '../../../../../stubs/backend/sector_teams_overview' );

describe( 'Sector teams overview transformer', function(){

	let output;

	beforeEach( function(){
	
		output = transform( input );
	} );

	it( 'Should add the images', function(){
	
		for( let team of output ){

			expect( team.image.url ).toBeDefined();
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

	it( 'Should limit the percentage to 100', function(){
	
		expect( output[ 0 ].value.percentage ).toEqual( 100 );
	} );

	it( 'Should round the percentage to whole numbers', function(){
	
		expect( output[ 0 ].hvcVsNonhvcPercentage ).toEqual( 21 );
		expect( output[ 1 ].value.percentage ).toEqual( 26 );
		expect( output[ 1 ].hvcVsNonhvcPercentage ).toEqual( 71 );

	} );

	it( 'Should define all colours and ensure they have a min of 0', function(){
	
		expect( output[ 0 ].hvcColours.red ).toEqual( 0 );
		expect( output[ 0 ].hvcColours.amber ).toEqual( 5 );
		expect( output[ 0 ].hvcColours.green ).toEqual( 5 );

		expect( output[ 3 ].hvcColours.red ).toEqual( 0 );
		expect( output[ 3 ].hvcColours.amber ).toEqual( 9 );
		expect( output[ 3 ].hvcColours.green ).toEqual( 0 );
	} );
} );
