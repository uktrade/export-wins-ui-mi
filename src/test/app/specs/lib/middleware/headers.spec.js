
const createMiddleware = require( '../../../../../app/lib/middleware/headers' );

describe( 'headers middleware', function(){

	let req;
	let res;
	let next;
	let middleware;

	beforeEach( function(){

		req = {};
		res = {
			setHeader: jasmine.createSpy( 'res.setHeader' )
		};
		next = jasmine.createSpy( 'next' );
	} );

	function checkHeadersForEveryRequest(){

		const args = res.setHeader.calls.allArgs();

		expect( args[ 0 ] ).toEqual( [ 'X-Download-Options', 'noopen' ] );
		expect( args[ 1 ] ).toEqual( [ 'X-XSS-Protection', '1; mode=block' ] );
		expect( args[ 2 ] ).toEqual( [ 'X-Content-Type-Options', 'nosniff' ] );
		expect( args[ 3 ] ).toEqual( [ 'X-Frame-Options', 'deny' ] );
		expect( args[ 4 ][ 0 ] ).toEqual( 'Content-Security-Policy' );
	}


	describe( 'Dev mode', function(){

		beforeEach( function(){

			middleware = createMiddleware( true );
		} );

		describe( 'All headers', function(){

			it( 'Should add the correct headers for all requests', function(){

				middleware( req, res, next );

				expect( res.setHeader.calls.count() ).toEqual( 5 );
				checkHeadersForEveryRequest();
			} );
		} );
	} );

	describe( 'Not in dev mode', function(){

		beforeEach( function(){

			middleware = createMiddleware( false );
		} );

		describe( 'All headers', function(){

			it( 'Should add the correct headers for all requests', function(){

				middleware( req, res, next );

				const lastArgs = res.setHeader.calls.argsFor( 5 );

				expect( res.setHeader.calls.count() ).toEqual( 6 );
				checkHeadersForEveryRequest();
				expect( lastArgs ).toEqual( [ 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains' ] );
			} );
		} );
	} );
} );