const isValidDate = require( '../../../../app/lib/is-valid-date' );

describe( 'isValidDate', function(){

	describe( 'When the date is not valid', function(){

		function fail( str ){

			expect( isValidDate( str ) ).toEqual( false );
		}

		it( 'Should return false', function(){

			fail( '2017-02-29' );
			fail( '2017-02-31' );
			fail( '2016-13-01' );
			fail( 'some text' );
		} );
	} );

	describe( 'When the date is valid', function(){

		function pass( str ){

			expect( isValidDate( str ) ).toEqual( true );
		}

		describe( 'With a full year', function(){

			it( 'Should return true', function(){

				pass( '2017-01-01' );
				pass( '2017-01-1' );
				pass( '2016-06-06' );
				pass( '2016-02-29' );//leap year
				pass( '2017-02-28' );
			} );
		} );

		describe( 'Without a full year', function(){

			it( 'Should return true', function(){

				pass( '16-06-06' );
				pass( '75-06-06' );
			} );
		} );
	} );
} );
