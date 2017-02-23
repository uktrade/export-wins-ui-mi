const largeNumber = require( '../../../../../app/lib/nunjucks-filters/large-number' );

describe( 'Large number', function(){

	describe( 'Just numbers', function(){
	
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
			testAll( 3084510000, '3.08b' );
		} );
	} );

	describe( 'Wrapping the unit marker', function(){
	
		it( 'Should return the number and the unit marker wrapped in a span', function(){
	
			function test( input, output ){

				expect( largeNumber( input, true ) ).toEqual( output );
			}

			function testAll( num, text, unit ){

				const output = ( text + '<span class="unit-marker">' + unit + '</span>' );
				const negNum = -num;
				const negOutput = ( '-' + output );

				test( num, output );
				test( negNum, negOutput );

				test( '' + num, output );
				test( '' + negNum, negOutput );
			}
		
			testAll( 2000000000, '2', 'b' );
			testAll( 200000000, '200', 'm' );
			testAll( 25000000, '25', 'm' );
			testAll( 1000000, '1', 'm' );
			testAll( 900000, '0.9', 'm' );
			testAll( 100000, '0.1', 'm' );
			testAll( 10000, '0.01', 'm' );
			testAll( 21863525, '21.86', 'm' );
			testAll( 3084510000, '3.08', 'b' );
		} );
	} );
} );
