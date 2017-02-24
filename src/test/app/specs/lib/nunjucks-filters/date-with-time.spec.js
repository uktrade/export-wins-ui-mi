const dateWithTime = require( '../../../../../app/lib/nunjucks-filters/date-with-time' );

describe( 'Date with time filter', function(){

	it( 'Should return the date and the time', function(){

		expect( dateWithTime( new Date( 1487928284460 ) ) ).toEqual( '9:24am 24 February 2017' );
	} );
} );
