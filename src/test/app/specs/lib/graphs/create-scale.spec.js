const createScale = require( '../../../../../app/lib/graphs/create-scale' );

describe( 'Create scale', function(){

	it( 'Should return a scale', function(){

		expect( createScale( 1234 ) ).toEqual( [ 0, 250, 500, 750, 1000, 1250 ] );
	} );
} );
