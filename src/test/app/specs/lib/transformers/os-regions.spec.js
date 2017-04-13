const transform = require( '../../../../../app/lib/transformers/os-regions' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const input = getBackendStub( '/os_regions/' );

describe( 'OS Regions List', function(){

	let output;

	beforeEach( function(){

		output = transform( input );
	} );

	describe( 'Grouping the regions', function(){

		it( 'Should create 6 groups of regions', function(){

			expect( output.length ).toEqual( 6 );

			expect( output[ 0 ].name ).toEqual( 'Europe' );
			expect( output[ 0 ].regions.length ).toEqual( 4 );

			expect( output[ 1 ].name ).toEqual( 'Near East and North Africa' );
			expect( output[ 1 ].regions.length ).toEqual( 3 );

			expect( output[ 2 ].name ).toEqual( 'East' );
			expect( output[ 2 ].regions.length ).toEqual( 3 );

			expect( output[ 3 ].name ).toEqual( 'South Pacific' );
			expect( output[ 3 ].regions.length ).toEqual( 2 );

			expect( output[ 4 ].name ).toEqual( 'Americas' );
			expect( output[ 4 ].regions.length ).toEqual( 2 );

			expect( output[ 5 ].name ).toEqual( 'East, West & South Africa' );
			expect( output[ 5 ].regions.length ).toEqual( 3 );
		} );

		it( 'Should have an id and name for each region', function(){

			for( let group of output ){

				for( let region of group.regions ){

					expect( region.id ).toBeDefined();
					expect( region.name ).toBeDefined();
				}
			}
		} );
	} );
} );
