const preciseNumber = require( '../../../../../app/lib/nunjucks-filters/precise-number' );

describe( 'Precise number', function(){

	describe( 'Just numbers', function(){

		it( 'Should format the numbers correctly', function(){

			function test( input, output ){

				expect( preciseNumber( input ) ).toEqual( output );
			}

			function testAll( num, output ){

				const negNum = -num;
				const negOutput = ( ( num === 0 ? '' : '-' ) + output );

				test( num, output );
				test( negNum, negOutput );

				test( '' + num, output );
				test( '' + negNum, negOutput );
			}

			testAll( 2000000000, '2b' );
			testAll( 200000000, '200m' );
			testAll( 25000000, '25m' );
			testAll( 1000000, '1m' );
			testAll( 900000, '900,000' );
			testAll( 100000, '100,000' );
			testAll( 90000, '90,000' );
			testAll( 50000, '50,000' );
			testAll( 20000, '20,000' );
			testAll( 10000, '10,000' );
			testAll( 5000, '5,000' );
			testAll( 4000, '4,000' );
			testAll( 3000, '3,000' );
			testAll( 2000, '2,000' );
			testAll( 1000, '1,000' );
			testAll( 200, '200' );
			testAll( 0, '0' );

			testAll( 21863525, '21.86m' );
			testAll( 3084510000, '3.08b' );
		} );
	} );

	describe( 'Without a number', function(){

		it( 'Should return null', function(){

			expect( preciseNumber() ).toEqual( null );
			expect( preciseNumber( 'test' ) ).toEqual( null );
		} );
	} );
} );
