
var mock = require( '../../../mocks/region-overview' );

describe( 'Overseas regions overview mock', function(){

	it( 'Should have the right data structure', function(){

		expect( mock.length ).toBe( 6 );

		for( let regionGroup of mock ){

			expect( regionGroup.image.name ).toBeDefined();
			expect( regionGroup.image.width ).toBeDefined();
			expect( regionGroup.image.height ).toBeDefined();
			expect( regionGroup.regions ).toBeDefined();

			for( let region of regionGroup.regions ){

				expect( region.name ).toBeDefined();
				expect( region.markets ).toBeDefined();
				expect( region.hvcColours.red ).toBeDefined();
				expect( region.hvcColours.amber ).toBeDefined();
				expect( region.hvcColours.green ).toBeDefined();
			}
		}
	} );
} );
