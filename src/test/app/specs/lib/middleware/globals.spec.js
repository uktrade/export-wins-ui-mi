const proxyquire = require( 'proxyquire' );

let middleware;

describe( 'Globals middleware', function(){

	let globalMiddleware;
	let req;
	let res;
	let next;
	let env;

	beforeEach( function(){

		middleware = proxyquire( '../../../../../app/lib/middleware/globals', {
			'../../config': {}
		} );

		env = {
			addGlobal: jasmine.createSpy( 'env.addGlobal' )
		};
		req = {
			url: '/'
		};
		res = {};

		globalMiddleware = middleware( env );
		next = jasmine.createSpy( 'next' );
	} );

	describe( 'baseUrlPrefix and urlPrefix', function(){

		describe( 'The current year', function(){

			beforeEach( function(){

				req.year ='2017';
				req.isDefaultYear = true;

				globalMiddleware( req, res, next );
			} );

			it( 'Should not add a year to the urlPrefix', function(){

				const args = env.addGlobal.calls.argsFor( 0 );

				expect( args[ 0 ] ).toEqual( 'urlPrefix' );
				expect( args[ 1 ] ).toEqual( '' );
			} );

			it( 'Should not add the year to the baseUrlPrefix', function(){

				const args = env.addGlobal.calls.argsFor( 1 );

				expect( args[ 0 ] ).toEqual( 'baseUrlPrefix' );
				expect( args[ 1 ] ).toEqual( '' );
			} );
		} );

		describe( 'Not the current year', function(){

			beforeEach( function(){

				req.year = '2016';
				req.isDefaultYear = false;

				globalMiddleware( req, res, next );
			} );

			it( 'Should add the year to urlPrefix', function(){

				const args = env.addGlobal.calls.argsFor( 0 );

				expect( args[ 0 ] ).toEqual( 'urlPrefix' );
				expect( args[ 1 ] ).toEqual( `/2016` );
			} );

			it( 'Should not add the year to the baseUrlPrefix', function(){

				const args = env.addGlobal.calls.argsFor( 1 );

				expect( args[ 0 ] ).toEqual( 'baseUrlPrefix' );
				expect( args[ 1 ] ).toEqual( '' );
			} );
		} );

		it( 'Should call next', function(){

			globalMiddleware( req, res, next );

			expect( next ).toHaveBeenCalled();
		} );
	} );

	describe( 'currentUrl', function(){

		describe( 'When the URL has no query params', function(){

			it( 'Should add the current url to the page', function(){

				req.url = '/my/test/url';

				globalMiddleware( req, res, next );

				const args = env.addGlobal.calls.argsFor( 2 );

				expect( args[ 0 ] ).toEqual( 'currentUrl' );
				expect( args[ 1 ] ).toEqual( req.url );
			} );
		} );

		describe( 'When the URL has query params', function(){

			it( 'Should remove the query params', function(){

				req.url = '/my/url/?test=1&a=2';

				globalMiddleware( req, res, next );

				const args = env.addGlobal.calls.argsFor( 2 );

				expect( args[ 1 ] ).toEqual( '/my/url/' );
			} );
		} );
	} );

	describe( 'addParams', function(){

		function getAddParams(){

			globalMiddleware( req, res, next );

			return env.addGlobal.calls.argsFor( 3 )[ 1 ];
		}

		it( 'Should add the function to the global', function(){

			globalMiddleware( req, res, next );

			const args = env.addGlobal.calls.argsFor( 3 );

			expect( args[ 0 ] ).toEqual( 'addParams' );
			expect( typeof args[ 1 ] ).toEqual( 'function' );
		} );

		describe( 'When there are filter params', function(){

			it( 'Should add the params to the path', function(){

				req.filters = { test: 1 };

				const addParams =getAddParams();

				expect( addParams( '/' ) ).toEqual( '/?test=1' );
			} );
		} );

		describe( 'When there are additonal params', function(){

			describe( 'When it is only additonal params', function(){

				it( 'Should add just the addional params to the path', function(){

					const addParams = getAddParams();

					expect( addParams( '/', { a: 1 }, { b: 2 } ) ).toEqual( '/?a=1&b=2' );
				} );
			} );

			describe( 'When ther are additonal params and filter params', function(){

				it( 'Should add all the params to the path', function(){

					req.filters = { test: 1 };

					const addParams = getAddParams();

					expect( addParams( '/a/b/', { c: 2, d: 3 } ) ).toEqual( '/a/b/?test=1&c=2&d=3' );
				} );
			} );
		} );
	} );
} );
