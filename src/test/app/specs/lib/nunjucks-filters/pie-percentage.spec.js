const piePercentage = require( '../../../../../app/lib/nunjucks-filters/pie-percentage' );

describe( 'Pie percentage filter', function(){

	function test( input, output ){

		expect( piePercentage( input ) ).toEqual( output );
	}

	describe( 'When the percentage is under 100', function(){
	
		it( 'Should return the percentage', function(){
	
			test( 1, 1 );
			test( 25, 25 );
			test( 58, 58 );
			test( 99, 99 );
		} );
	} );

	describe( 'When the percentage equals 100', function(){
	
		it( 'Should return 99.99 percent to fix a rendering bug', function(){
	
			test( 100, 99.99 );
		} );
	} );
} );
