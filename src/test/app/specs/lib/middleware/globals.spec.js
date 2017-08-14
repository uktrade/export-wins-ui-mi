const proxyquire = require( 'proxyquire' );

let middleware;

describe( 'Globals middleware', function(){

	let globalMiddleware;
	let req;
	let res;
	let next;
	let env;
	let urlsSpy;

	beforeEach( function(){

		urlsSpy = jasmine.createSpy( 'urls' );

		middleware = proxyquire( '../../../../../app/lib/middleware/globals', {
			'../urls': () => urlsSpy
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

	describe( 'urls', function(){

		it( 'Should add the function to the global', function(){

			globalMiddleware( req, res, next );

			const args = env.addGlobal.calls.argsFor( 0 );

			expect( args[ 0 ] ).toEqual( 'urls' );
			expect( args[ 1 ] ).toEqual( urlsSpy );
		} );
	} );
} );
