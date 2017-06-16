const transform = require( '../../../../../app/lib/transformers/os-regions-overview' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const input = getBackendStub( '/os_regions/overview.2016' );

describe( 'Overseas Regions Overview transformer', function(){

	let output = transform( input.results );

	describe( 'The regions', function(){

		it( 'Should have the right properties for each region in the group', function(){

			output.forEach( ( region ) => {

				expect( region.id ).toBeDefined();
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

		it( 'Should add a capped percentage of 100, along with a marker to say it is over', function() {

			expect( output[ 0 ].values.hvc.targetPercent.unconfirmed.isOver ).toEqual( false );
			expect( output[ 0 ].values.hvc.targetPercent.unconfirmed.capped ).toEqual( 95 );
			expect( output[ 0 ].values.hvc.targetPercent.unconfirmed.value ).toEqual( 95 );

			expect( output[ 2 ].values.hvc.targetPercent.unconfirmed.isOver ).toEqual( false );
			expect( output[ 2 ].values.hvc.targetPercent.unconfirmed.capped ).toEqual( 79 );
			expect( output[ 2 ].values.hvc.targetPercent.unconfirmed.value ).toEqual( 79 );

			expect( output[ 1 ].values.hvc.targetPercent.confirmed.isOver ).toEqual( false );
			expect( output[ 1 ].values.hvc.targetPercent.confirmed.capped ).toEqual( 98 );
			expect( output[ 1 ].values.hvc.targetPercent.confirmed.value ).toEqual( 98 );
		});

		it( 'Should return whole numbers for the percentages', function(){

			expect( output[ 0 ].confirmedPercent.hvc ).toEqual( 46 );
			expect( output[ 6 ].confirmedPercent.hvc ).toEqual( 80 );
		} );
	} );
} );
