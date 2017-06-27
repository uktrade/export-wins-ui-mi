
const getCeil = require( '../../../../../app/lib/graphs/get-ceil' );

describe( 'Get Ceil', function(){

	it( 'Should get the ceiling number', function(){

		expect( getCeil( 1234, [ 0, 0.25 ] ) ).toEqual( 1250 );
		expect( getCeil( 142000, [ 0, 0.25 ] ) ).toEqual( 150000 );
		expect( getCeil( 501000, [ 0, 0.25 ] ) ).toEqual( 525000 );
		expect( getCeil( 65432100, [ 0, 0.25 ] ) ).toEqual( 67500000 );
		//test for 100% code coverage
		expect( getCeil( 100, [ 0, Infinity ] ) ).toEqual( Infinity );
		expect( getCeil( 100000, [ -100000, 100 ] ) ).toEqual( 10000000 );
	} );

	describe( 'Defaults', function(){

		describe( 'When a to is not specified', function(){

			it( 'Has a default value', function(){

				expect( getCeil( 1234 ) ).toEqual( 2000 );
			} );
		} );
	} );
} );
