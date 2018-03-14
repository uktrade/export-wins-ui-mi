const createScale = require( '../../../../../app/lib/graphs/create-scale' );

describe( 'Create scale', function(){

	describe( 'Without specifying the number of points', function(){

		describe( 'When the max is 0', function(){

			it( 'Should return the scale with all zeros', function(){

				expect( createScale( 0 ) ).toEqual( [ 0, 0, 0, 0 ,0 ] );
			} );
		} );

		describe( 'Specifying a max', function(){

			it( 'Should return a scale', function(){

				expect( createScale( 1 ) ).toEqual( [ 0, 0.2, 0.4, 0.6000000000000001, 0.8, 1 ] );
				expect( createScale( 2 ) ).toEqual( [ 0, 1, 2, 3, 4, 5 ] );
				expect( createScale( 3 ) ).toEqual( [ 0, 1, 2, 3, 4, 5 ] );
				expect( createScale( 4 ) ).toEqual( [ 0, 1, 2, 3, 4, 5 ] );
				expect( createScale( 5 ) ).toEqual( [ 0, 1, 2, 3, 4, 5 ] );
				expect( createScale( 6 ) ).toEqual( [ 0, 2, 4, 6, 8, 10 ] );
				expect( createScale( 7 ) ).toEqual( [ 0, 2, 4, 6, 8, 10 ] );
				expect( createScale( 8 ) ).toEqual( [ 0, 2, 4, 6, 8, 10 ] );
				expect( createScale( 9 ) ).toEqual( [ 0, 2, 4, 6, 8, 10 ] );
				expect( createScale( 10 ) ).toEqual( [ 0, 2, 4, 6, 8, 10 ] );
				expect( createScale( 11 ) ).toEqual( [ 0, 3, 6, 9, 12, 15 ] );
				expect( createScale( 12 ) ).toEqual( [ 0, 3, 6, 9, 12, 15 ] );
				expect( createScale( 13 ) ).toEqual( [ 0, 3, 6, 9, 12, 15 ] );
				expect( createScale( 14 ) ).toEqual( [ 0, 3, 6, 9, 12, 15 ] );
				expect( createScale( 15 ) ).toEqual( [ 0, 3, 6, 9, 12, 15 ] );
				expect( createScale( 1234 ) ).toEqual( [ 0, 250, 500, 750, 1000, 1250 ] );
			} );
		} );
	} );

	describe( 'When specifying the number of points', function(){

		it( 'Should return a scale using the points', function(){

			expect( createScale( 1, 4 ) ).toEqual( [ 0, 0.25, 0.5, 0.75, 1 ] );
			expect( createScale( 100, 4 ) ).toEqual( [ 0, 25, 50, 75, 100 ] );

			expect( createScale( 1, 3 ) ).toEqual( [ 0, 0.3333333333333333, 0.6666666666666666, 1 ] );
			expect( createScale( 100, 3 ) ).toEqual( [ 0, 33.333333333333336, 66.66666666666667, 100 ] );
		} );
	} );
} );
