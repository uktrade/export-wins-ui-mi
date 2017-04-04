
const getCeil = require( '../../../../../app/lib/graphs/get-ceil' );

describe( 'Get Ceil', function(){

	it( 'Should get the ceiling number', function(){

		expect( getCeil( 1234, [ 0, 0.25 ] ) ).toEqual( 1250 );
		expect( getCeil( 142000, [ 0, 0.25 ] ) ).toEqual( 150000 );
		expect( getCeil( 501000, [ 0, 0.25 ] ) ).toEqual( 525000 );
		expect( getCeil( 65432100, [ 0, 0.25 ] ) ).toEqual( 67500000 );
	} );
} );
