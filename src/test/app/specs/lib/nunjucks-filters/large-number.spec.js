const largeNumber = require( '../../../../../app/lib/nunjucks-filters/large-number' );

describe( 'Large number', function(){

	it( 'Should format the numbers correctly', function(){

		function test( input, output ){

			expect( largeNumber( input ) ).toEqual( output );
		}

		function testAll( num, output ){

			const negNum = -num;
			const negOutput = ( '-' + output );

			test( num, output );
			test( negNum, negOutput );

			test( '' + num, output );
			test( '' + negNum, negOutput );
		}
	
		testAll( 2000000000, '2b' );
		testAll( 200000000, '200m' );
		testAll( 25000000, '25m' );
		testAll( 1000000, '1m' );
		testAll( 900000, '0.9m' );
		testAll( 100000, '0.1m' );
		testAll( 10000, '0.01m' );
		testAll( 21863525, '21.86m' );
	} );
} );
