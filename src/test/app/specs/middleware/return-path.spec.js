
const middleware = require( '../../../../app/middleware/return-path' );

describe( 'returnPath middleware', function(){

	let req;
	let res;
	let next;

	beforeEach( function(){

		req = {};
		res = {
			locals: {}
		};
		next = jasmine.createSpy( 'next' );
	} );

	describe( 'When there is a path in the URL', function(){

		describe( 'When the path is releative', function(){

			it( 'Should add the returnPath to the req', function(){

				const path = '/my/test/';
				req.query = { path };

				middleware( req, res, next );

				expect( req.returnPath ).toEqual( path );
				expect( res.locals.returnPath ).toEqual( path );
				expect( next ).toHaveBeenCalled();
			} );
		} );

		describe( 'When the path is not relative', function(){

			describe( 'With a protocol in the URL', function(){

				it( 'Should ignore the path', function(){

					req.query = { path: 'http://my.bad.url.com/' };

					middleware( req, res, next );

					expect( req.returnPath ).toBeUndefined();
					expect( res.locals.returnPath ).toBeUndefined();
					expect( next ).toHaveBeenCalled();
				} );
			} );

			describe( 'Without a protocol in the URL', function(){

				it( 'Should ignore the path', function(){

					req.query = { path: '//my.bad.url.com/' };

					middleware( req, res, next );

					expect( req.returnPath ).toBeUndefined();
					expect( res.locals.returnPath ).toBeUndefined();
					expect( next ).toHaveBeenCalled();
				} );
			} );
		} );
	} );
} );
