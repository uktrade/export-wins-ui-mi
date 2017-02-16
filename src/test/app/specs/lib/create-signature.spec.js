let proxyquire = require( 'proxyquire' );

let stubs = {
	'../config': { backend: { secret: 'othersecret' } }
};

let createSignature = proxyquire( '../../../../app/lib/create-signature', stubs );

describe( 'createSignature', function(){

	describe( 'When there is a path only', function(){
	
		it( 'Returns the signature', function(){
	
			expect( createSignature( '/mi/' ) ).toEqual( 'fe08a1793badb040dd9fd4a8039ef85ce680a0f0489851a5874d696f74ab91a3' );
		} );
	} );

	describe( 'When there is a path with a query param', function(){
	
		it( 'Returns the signature', function(){
	
			expect( createSignature( '/test/?param=testing' ) ).toEqual( 'ec14686a1171270bb16ea8675fe267abafdb321bc7ee636e0746c94f23fbc7e1' );
		} );
	} );

	describe( 'When there is a path and body', function(){
	
		it( 'Returns the signature', function(){
	
			expect( createSignature( '/test/?param=myparam', 'body=bodyContent' ) ).toEqual( '8c982ed3f8571446bfed7156bdafed1280f6882225ce9deaafbe0bcaff60cbdd' );
		} );
	} );
} );
