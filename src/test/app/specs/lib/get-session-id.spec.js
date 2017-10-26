const getSessionId = require( '../../../../app/lib/get-session-id' );

describe( 'Get session id', function(){

	describe( 'When there is a sessionid', function(){

		const cookies = [
			'my-cookie=blah',
			'sessionid=1234'
		];

		it( 'Should return the session id from the list of cookies', function(){

			expect( getSessionId( cookies ) ).toEqual( cookies[ 1 ] );
		} );
	} );

	describe( 'When there is not a sessionid', function(){

		const cookies = [];

		it( 'Should return an empty string', function(){

			expect( getSessionId( cookies ) ).toEqual( '' );
		} );
	} );

	describe( 'When the cookies is undefined', function(){

		it( 'Should return an empty string', function(){

				expect( getSessionId() ).toEqual( '' );
		} );
	} );
} );
