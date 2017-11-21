const safePath = require( '../../../../app/lib/safe-path' );

describe( 'Safe path', function(){

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
