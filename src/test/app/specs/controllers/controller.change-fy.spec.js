const proxyquire = require( 'proxyquire' );
const spy = require( '../../helpers/spy' );

const modulePath = '../../../../app/controllers/controller.change-fy';

let req;
let res;
let controller;
let safePathResponse;
let safePath;

describe( 'Refresh controller', function(){

	beforeEach( function(){

		safePathResponse = 'blah';

		safePath = spy( 'safePath', safePathResponse );

		req = {
			query: {}
		};

		res = {
			redirect: spy( 'res.redirect' )
		};

		controller = proxyquire( modulePath, {
			'../lib/safe-path': safePath
		} );
	} );

	describe( 'When a path is specified', function(){

		it( 'Should redirect to the output of safePath', function(){

			const myPath = 'some-path';
			req.query.path = myPath;

			controller( req, res );

			expect( safePath ).toHaveBeenCalledWith( myPath );
			expect( res.redirect ).toHaveBeenCalledWith( safePathResponse );
		} );
	} );

	describe( 'When a path is not specified', function(){

		it( 'Should redirect to the output of safePath', function(){

			let undef;

			controller( req, res );

			expect( safePath ).toHaveBeenCalledWith( undef );
			expect( res.redirect ).toHaveBeenCalledWith( safePathResponse );
		} );
	} );
} );
