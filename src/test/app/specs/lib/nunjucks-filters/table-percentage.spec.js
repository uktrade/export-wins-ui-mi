const tablePercentage = require( '../../../../../app/lib/nunjucks-filters/table-percentage' );

describe( 'Table percentage filter', function(){

	function test( input, output ){

		expect( tablePercentage( input ) ).toEqual( output );
	}

	describe( 'When the percentage is under 100', function(){
	
		it( 'Should return the percentage with a decimal place', function(){
	
			test( 1.25, 1.25 );
			test( 25.5, 25.5 );
			test( 58.05, 58.05 );
			test( 99.99, 99.99 );
		} );
	} );

	describe( 'When the percentage 100 or more', function(){
	
		it( 'Should round the percentage and return an int', function(){
	
			test( 100.25, 100 );
			test( 1000.75, 1001 );
			test( 5000.95, 5001 );
		} );
	} );
} );
