const dateStamp = require( '../../../../../app/lib/nunjucks-filters/date-stamp' );

describe( 'Date stamp filter', function(){

	describe( 'When a data is supplied', function(){

		describe( 'With a date string', function(){

			it( 'Should return just the date', function(){

				expect( dateStamp( '2016-04-01' ) ).toEqual( '01-04-2016' );
			} );
		} );

		describe( 'With a GMT date string', function(){

			it( 'Should return just the date', function(){

				expect( dateStamp( 'Fri, 31 Mar 2017 00:00:00 GMT' ) ).toEqual( '31-03-2017' );
			} );
		} );

		describe( 'With a UTC timestamp', function(){

			it( 'Should return the correct date', function(){

				expect( dateStamp( 1491004799 * 1000 ) ).toEqual( '31-03-2017' );
			} );
		} );
	} );

	describe( 'When a date is not supplied', function(){

		it( 'Should default to an empty string', function(){

			expect( dateStamp() ).toEqual( '' );
		} );
	} );
} );
