const dateWithTime = require( '../../../../../app/lib/nunjucks-filters/date-with-time' );

describe( 'Date with time filter', function(){

	describe( 'With just a date', function(){

		describe( 'With a UTC timestamp', function(){

			it( 'Should return the correct date and time', function(){

				expect( dateWithTime( new Date( 1491004799 * 1000 ) ) ).toEqual( '11:59pm 31 March 2017' );
			} );
		} );

		it( 'Should return the date and the time', function(){

			expect( dateWithTime( new Date( 1487928284460 ) ) ).toEqual( '9:24am 24 February 2017' );
		} );
	} );

	describe( 'With a date and a max date', function(){

		describe( 'When the date is lower than the maxDate', function(){

			it( 'Should return the date', function(){

				expect( dateWithTime( new Date( 1487928284460 ), '2017-03-31:23:59 GMT' ) ).toEqual( '9:24am 24 February 2017' );
			} );
		} );

		describe( 'When the max date is greater than the date', function(){

			it( 'Should return the max date', function(){

				expect( dateWithTime( new Date( 1517443200000 ), '2017-03-31:23:59 GMT' ) ).toEqual( '11:59pm 31 March 2017' );
			} );
		} );
	} );
} );
