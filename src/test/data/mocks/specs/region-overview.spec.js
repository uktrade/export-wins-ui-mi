
const mock = require( '../../../../data/mocks/region-overview' );

const imagePath = /^\/public\/img\/overseas-region-maps\/[0-9]+\.png/;

describe( 'Overseas regions overview mock', function(){

	it( 'Should have the right data structure', function(){

		expect( mock.length ).toBe( 6 );

		for( let regionGroup of mock ){

			expect( regionGroup.image.url ).toBeDefined();
			expect( imagePath.test( regionGroup.image.url ) ).toEqual( true );
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
