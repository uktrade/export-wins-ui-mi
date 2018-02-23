const proxyquire = require( 'proxyquire' );

let middleware;

describe( 'Globals middleware', function(){

	let globalMiddleware;
	let req;
	let res;
	let next;
	let env;
	let urlsSpy;
	let financialYearSpy;
	let financialYearReponse;

	beforeEach( function(){

		financialYearReponse = 2017;

		urlsSpy = jasmine.createSpy( 'urls' );
		financialYearSpy = jasmine.createSpy( 'financialYear' ).and.callFake( () => financialYearReponse );


		middleware = proxyquire( '../../../../app/middleware/globals', {
			'../lib/urls': () => urlsSpy,
			'../lib/financial-year': financialYearSpy
		} );

		env = {
			addGlobal: jasmine.createSpy( 'env.addGlobal' )
		};
		req = {
			url: '/',
			year: '100'
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

	describe( 'Current Financial Year', function(){

		it( 'Should add the year to the global', function(){

			globalMiddleware( req, res, next );

			const args = env.addGlobal.calls.argsFor( 1 );

			expect( args[ 0 ] ).toEqual( 'currentFy' );
			expect( args[ 1 ] ).toEqual( financialYearReponse );
		} );
	} );

	describe( 'Selected Financial Year', function(){

		it( 'Should add the year to the global', function(){

			globalMiddleware( req, res, next );

			const args = env.addGlobal.calls.argsFor( 2 );

			expect( args[ 0 ] ).toEqual( 'selectedYear' );
			expect( args[ 1 ] ).toEqual( Number( req.year ) );
		} );
	} );
} );
