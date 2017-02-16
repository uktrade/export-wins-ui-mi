const transform = require( '../../../../../app/lib/transformers/os-regions-overview' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const input = getBackendStub( '/os_regions/overview' );

describe( 'Overseas Regions Overview transformer', function(){

	let output = transform( input );

	describe( 'Grouping the regions', function(){
	
		it( 'Should group the regions', function(){
		
			expect( output.length ).toEqual( 6 );
		} );

		it( 'Should add an image to each group', function(){
		
			output.forEach( ( group ) => {

				const image = group.image;

				expect( image.url ).toBeDefined();
				expect( image.width ).toBeDefined();
				expect( image.height ).toBeDefined();
			} );
		} );

	} );

	describe( 'The regions', function(){
	
		it( 'Should have the right properties and add a colour to each region in the group', function(){
		
			output.forEach( ( group ) => {

				group.regions.forEach( ( region ) => {

					expect( region.colour ).toBeDefined();
					expect( region.name ).toBeDefined();
					expect( region.markets ).toBeDefined();
					expect( region.value.current ).toBeDefined();
					expect( region.value.target ).toBeDefined();
					expect( region.value.percentage ).toBeDefined();
					expect( region.confirmedPercent.hvc ).toBeDefined();
					expect( region.confirmedPercent.nonHvc ).toBeDefined();
					expect( region.hvcPerformance.red ).toBeDefined();
					expect( region.hvcPerformance.amber ).toBeDefined();
					expect( region.hvcPerformance.green ).toBeDefined();
				} );
			} );
		} );

		it( 'Should limit the percentages to 100', function() {
			
			expect( output[ 0 ].regions[ 0 ].value.percentage ).toEqual( 100 );
			expect( output[ 1 ].regions[ 0 ].value.percentage ).toEqual( 100 );
		});

		it( 'Should return whole numbers for the percentages', function(){

			expect( output[ 0 ].regions[ 0 ].confirmedPercent.hvc ).toEqual( 13 );
			expect( output[ 1 ].regions[ 0 ].confirmedPercent.hvc ).toEqual( 16 );
		} );

	} );
} );
