const pluralise = require( '../../../../../app/lib/nunjucks-filters/pluralise' );

describe( 'Pluralise filter', function(){

	describe( 'When the amount is 1', function(){

		it( 'Should use the text', function(){

			expect( pluralise( 1, 'day' ) ).toEqual( '1 day' );
		} );
	} );

	describe( 'When the amount is not 1', function(){

		describe( 'When a plural is not passsed', function(){

			it( 'Should add an s to the text', function(){

				expect( pluralise( 2, 'day' ) ).toEqual( '2 days' );
			} );
		} );

		describe( 'When a plural is passed', function(){

			it( 'Should use the plural', function(){

				expect( pluralise( 3, 'day', 'blah' ) ).toEqual( '3 blah' );
			} );
		} );
	} );

} );
