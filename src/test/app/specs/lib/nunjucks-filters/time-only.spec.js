const mockDate = require( 'mockdate' );
const timeOnly = require( '../../../../../app/lib/nunjucks-filters/time-only' );

describe( 'Time only filter', function(){

	describe( 'When a date is supplied', function(){

		describe( 'With a date string', function(){

			it( 'Should return just the time', function(){

				expect( timeOnly( '2016-04-01' ) ).toEqual( '00:00' );
			} );
		} );

		describe( 'With a GMT date string', function(){

			it( 'Should return just the time', function(){

				expect( timeOnly( 'Fri, 31 Mar 2017 15:31:00 GMT' ) ).toEqual( '15:31' );
			} );
		} );

		describe( 'With a UTC timestamp', function(){

			it( 'Should return the correct time', function(){

				expect( timeOnly( 1491004799 * 1000 ) ).toEqual( '23:59' );
			} );
		} );

		describe( 'With a random string', function(){

			it( 'Should default to an empty string', function(){

				expect( timeOnly( 'sometext' ) ).toEqual( '' );
			} );
		} );
	} );

	describe( 'When a date is not supplied', function(){

		it( 'Should default to the current time', function(){

			mockDate.set( 1498468857907 );
			expect( timeOnly() ).toEqual( '09:20' );
			mockDate.reset();
		} );
	} );
} );
