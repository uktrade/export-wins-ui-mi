const closestGreatestInteger = require( '../../../../../app/lib/graphs/closest-greatest-integer' );

describe( 'Closest integer', function(){

	it( 'Should return a number', function(){

		expect( closestGreatestInteger( 1, 5 ) ).toEqual( 5 );
		expect( closestGreatestInteger( 2, 5 ) ).toEqual( 5 );
		expect( closestGreatestInteger( 3, 5 ) ).toEqual( 5 );
		expect( closestGreatestInteger( 4, 5 ) ).toEqual( 5 );
		expect( closestGreatestInteger( 5, 5 ) ).toEqual( 5 );
		expect( closestGreatestInteger( 6, 5 ) ).toEqual( 10 );
		expect( closestGreatestInteger( 7, 5 ) ).toEqual( 10 );
		expect( closestGreatestInteger( 8, 5 ) ).toEqual( 10 );
		expect( closestGreatestInteger( 9, 5 ) ).toEqual( 10 );
		expect( closestGreatestInteger( 10, 5 ) ).toEqual( 10 );
	} );
} );
