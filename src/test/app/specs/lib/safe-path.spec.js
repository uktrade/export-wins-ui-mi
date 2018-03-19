const safePath = require( '../../../../app/lib/safe-path' );

describe( 'Safe path', function(){

	describe( 'When there is a path', function(){

		it( 'Should only return a safe redirect path', function(){

			const inputs = [
				[ 'https://www.test.com', '/' ],
				[ 'http://test.com', '/' ],
				[ '//www.test.com', '/' ],
				[ '/', '/' ],
				[ '/relative/', '/relative/' ]
			];

			for( let i = 0, l = inputs.length; i < l; i++ ){

				const [ input, output ] = inputs[ i ];

				expect( safePath( input ) ).toEqual( output );
			}
		} );
	} );

	describe( 'When the path is undefined', function(){

		it( 'Should return the default path', function(){

			expect( safePath() ).toEqual( '/' );
		} );
	} );

	describe( 'When the path is null', function(){

		it( 'Should return the default path', function(){

			expect( safePath( null ) ).toEqual( '/' );
		} );
	} );

	describe( 'When the path is boolean true', function(){

		it( 'Should return the default path', function(){

			expect( safePath( true ) ).toEqual( '/' );
		} );
	} );
} );
