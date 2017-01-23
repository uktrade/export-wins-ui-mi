const transform = require( '../../../../../app/lib/transformers/sector-teams-overview' );
const input = require( '../../../../../stubs/backend/sector_teams/overview' );

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

			expect( team.id ).toBeDefined();
			expect( team.name ).toBeDefined();
			expect( team.hvcColours ).toBeDefined();
			expect( team.hvcGroups ).toBeDefined();
			expect( team.value.percentage ).toBeDefined();
			expect( team.value.current ).toBeDefined();
			expect( team.value.target ).toBeDefined();
			expect( team.hvcVsNonhvcPercentage ).toBeDefined();
		}
	} );

	it( 'Should give the HVC Groups the correct properties', function(){
	
		for( let team of output ){

			for( let hvcGroup of team.hvcGroups ){

				expect( hvcGroup.id ).toBeDefined();
				expect( hvcGroup.name ).toBeDefined();
				expect( hvcGroup.hvcColours ).toBeDefined();
				expect( hvcGroup.value.percentage ).toBeDefined();
				expect( hvcGroup.value.current ).toBeDefined();
				expect( hvcGroup.value.target ).toBeDefined();
				expect( hvcGroup.hvcVsNonhvcPercentage ).toBeDefined();
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
