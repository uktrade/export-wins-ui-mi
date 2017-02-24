const dateOnly = require( '../../../../../app/lib/nunjucks-filters/date-only' );

describe( 'Date only filter', function(){

	it( 'Should return just the date', function(){

		expect( dateOnly( '2016-04-01' ) ).toEqual( '1 April 2016' );
	} );
} );
