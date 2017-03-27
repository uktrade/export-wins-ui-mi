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


		it( 'Should have the correct name', function(){
		
			expect( output[ 0 ].name ).toEqual( 'Europe' );
			expect( output[ 1 ].name ).toEqual( 'Near East & North Africa' );
			expect( output[ 2 ].name ).toEqual( 'East' );
			expect( output[ 3 ].name ).toEqual( 'South Pacific' );
			expect( output[ 4 ].name ).toEqual( 'East, West & South Africa' );
			expect( output[ 5 ].name ).toEqual( 'Americas' );
		} );
	} );

	describe( 'The regions', function(){
	
		it( 'Should have the right properties and add a colour to each region in the group', function(){
		
			output.forEach( ( group ) => {

				group.regions.forEach( ( region ) => {

					expect( region.id ).toBeDefined();
					expect( region.colour ).toBeDefined();
					expect( region.name ).toBeDefined();
					expect( region.markets ).toBeDefined();
					expect( region.values.hvc.target ).toBeDefined();
					expect( region.values.hvc.current.confirmed ).toBeDefined();
					expect( region.values.hvc.current.unconfirmed ).toBeDefined();
					expect( region.values.hvc.targetPercent.confirmed ).toBeDefined();
					expect( region.values.hvc.targetPercent.unconfirmed ).toBeDefined();
					expect( region.confirmedPercent.hvc ).toBeDefined();
					expect( region.confirmedPercent.nonHvc ).toBeDefined();
					expect( region.hvcPerformance.red ).toBeDefined();
					expect( region.hvcPerformance.amber ).toBeDefined();
					expect( region.hvcPerformance.green ).toBeDefined();
					expect( region.hvcPerformance.zero ).toBeDefined();
				} );
			} );
		} );

		it( 'Should add a capped percentage of 100, along with a marker to say it is over', function() {
			
			expect( output[ 0 ].regions[ 0 ].values.hvc.targetPercent.unconfirmed.isOver ).toEqual( true );
			expect( output[ 0 ].regions[ 0 ].values.hvc.targetPercent.unconfirmed.capped ).toEqual( 100 );
			expect( output[ 0 ].regions[ 0 ].values.hvc.targetPercent.unconfirmed.value ).toEqual( 105 );

			expect( output[ 0 ].regions[ 2 ].values.hvc.targetPercent.unconfirmed.isOver ).toEqual( false );
			expect( output[ 0 ].regions[ 2 ].values.hvc.targetPercent.unconfirmed.capped ).toEqual( 89 );
			expect( output[ 0 ].regions[ 2 ].values.hvc.targetPercent.unconfirmed.value ).toEqual( 89 );

			expect( output[ 4 ].regions[ 1 ].values.hvc.targetPercent.confirmed.isOver ).toEqual( true );
			expect( output[ 4 ].regions[ 1 ].values.hvc.targetPercent.confirmed.capped ).toEqual( 100 );
			expect( output[ 4 ].regions[ 1 ].values.hvc.targetPercent.confirmed.value ).toEqual( 129 );
		});

		it( 'Should return whole numbers for the percentages', function(){

			expect( output[ 0 ].regions[ 0 ].confirmedPercent.hvc ).toEqual( 22 );
			expect( output[ 1 ].regions[ 0 ].confirmedPercent.hvc ).toEqual( 46 );
		} );
	} );
} );
