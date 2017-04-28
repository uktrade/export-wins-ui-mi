
const middleware = require( '../../../../../app/lib/middleware/login-check' );

describe( 'loginCheck middleware', function(){

	let req;
	let res;
	let next;

	beforeEach( function(){

		req = {
			cookies: {}
		};
		next = jasmine.createSpy( 'next' );
	} );

	describe( 'When there is a cookie', function(){

		it( 'Should call next', function(){

			req.cookies.sessionid = 'test=123';
			res = {};

			middleware( req, res, next );

			expect( next ).toHaveBeenCalled();
		} );
	} );

	describe( 'When there is not a cookie', function(){

		it( 'Should redirect to the login page', function(){

			res = {
				redirect: jasmine.createSpy( 'res.redirect' )
			};

			middleware( req, res, next );

			expect( res.redirect ).toHaveBeenCalledWith( '/login/' );
			expect( next ).not.toHaveBeenCalled();
		} );
	} );
} );
