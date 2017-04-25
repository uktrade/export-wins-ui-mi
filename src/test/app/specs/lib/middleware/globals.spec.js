const proxyquire = require( 'proxyquire' );

const uuid = 'abc123';

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
		res = {};

		globalMiddleware = middleware( env );
		next = jasmine.createSpy( 'next' );
	} );

	describe( 'baseUrlPrefix and urlPrefix', function(){

		describe( 'The current year', function(){

			beforeEach( function(){

				req = {
					year: '2017',
					isCurrentYear: true
				};

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

		xdescribe( 'Not the current year', function(){

			beforeEach( function(){

				req = {
					year: '2016',
					isCurrentYear: false
				};
				globalMiddleware( req, res, next );
			} );

			it( 'Should add the year to urlPrefix', function(){

				const args = env.addGlobal.calls.argsFor( 0 );

				expect( args[ 0 ] ).toEqual( 'urlPrefix' );
				expect( args[ 1 ] ).toEqual( `/${ uuid }/2016` );
			} );

			it( 'Should not add the year to the baseUrlPrefix', function(){

				const args = env.addGlobal.calls.argsFor( 1 );

				expect( args[ 0 ] ).toEqual( 'baseUrlPrefix' );
				expect( args[ 1 ] ).toEqual( `/${ uuid }` );
			} );
		} );

		it( 'Should call next', function(){

			globalMiddleware( req, res, next );

			expect( next ).toHaveBeenCalled();
		} );
	} );

} );
