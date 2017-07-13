const dateOnly = require( '../../../../../app/lib/nunjucks-filters/date-only' );

describe( 'Date only filter', function(){

	describe( 'When a data is supplied', function(){

		describe( 'With a date string', function(){

			it( 'Should return just the date', function(){

				expect( dateOnly( '2016-04-01' ) ).toEqual( '1 April 2016' );
			} );
		} );

		describe( 'With a UTC timestamp', function(){

			it( 'Should return the correct date', function(){

				expect( dateOnly( 1491004799 * 1000 ) ).toEqual( '31 March 2017' );
			} );
		} );
	} );

	describe( 'When a date is not supplied', function(){

		it( 'Should default to an empty string', function(){

			expect( dateOnly() ).toEqual( '' );
		} );
	} );
} );
