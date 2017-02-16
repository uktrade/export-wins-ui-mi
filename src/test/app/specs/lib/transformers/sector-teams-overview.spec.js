const transform = require( '../../../../../app/lib/transformers/sector-teams-overview' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const input = getBackendStub( '/sector_teams/overview' );

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
			expect( team.hvcPerformance ).toBeDefined();
			expect( team.hvcGroups ).toBeDefined();
			expect( team.value.percentage ).toBeDefined();
			expect( team.value.current ).toBeDefined();
			expect( team.value.target ).toBeDefined();
			expect( team.confirmedPercent.hvc ).toBeDefined();
			expect( team.confirmedPercent.nonHvc ).toBeDefined();
		}
	} );

	it( 'Should give the HVC Groups the correct properties', function(){
	
		for( let team of output ){

			for( let hvcGroup of team.hvcGroups ){

				expect( hvcGroup.id ).toBeDefined();
				expect( hvcGroup.name ).toBeDefined();
				expect( hvcGroup.hvcPerformance ).toBeDefined();
				expect( hvcGroup.value.percentage ).toBeDefined();
				expect( hvcGroup.value.current ).toBeDefined();
				expect( hvcGroup.value.target ).toBeDefined();
				expect( hvcGroup.confirmedPercent ).not.toBeDefined();
			}
		}
	} );

	it( 'Should limit the percentage to 100', function(){
	
		expect( output[ 0 ].value.percentage ).toEqual( 100 );
	} );

	it( 'Should define all colours and ensure they have a min of 0', function(){
	
		expect( output[ 0 ].hvcPerformance.red ).toEqual( 0 );
		expect( output[ 0 ].hvcPerformance.amber ).toEqual( 13 );
		expect( output[ 0 ].hvcPerformance.green ).toEqual( 0 );

		expect( output[ 3 ].hvcPerformance.red ).toEqual( 0 );
		expect( output[ 3 ].hvcPerformance.amber ).toEqual( 23 );
		expect( output[ 3 ].hvcPerformance.green ).toEqual( 25 );

		expect( output[ 4 ].hvcPerformance.red ).toEqual( 9 );
		expect( output[ 4 ].hvcPerformance.amber ).toEqual( 0 );
		expect( output[ 4 ].hvcPerformance.green ).toEqual( 22 );
	} );
} );
