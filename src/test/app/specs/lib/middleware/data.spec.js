const EventEmitter = require( 'events' );
const middleware = require( '../../../../../app/lib/middleware/data' );

class Req extends EventEmitter {}

describe( 'data middleware', function(){

	let req;
	let res;

	beforeEach( function(){

		req = new Req();
		res = {
			locals: {}
		};
	} );

	describe( 'When data is emitted and end is emitted', function(){

		it( 'Should capture the data, add it to the req and then call next', function( done ){

			middleware( req, res, function(){

				expect( req.data ).toEqual( 'chunk1chunk2' );
				done();
			} );

			req.emit( 'data', 'chunk1' );
			req.emit( 'data', 'chunk2' );
			req.emit( 'end' );
		} );
	} );

	describe( 'When an error is emitted', function(){

		it( 'Should call next with the error', function( done ){

			const error = new Error( 'test' );

			middleware( req, res, function( err ){

				expect( err ).toEqual( error );
				done();
			} );

			req.emit( 'error', error );
		} );
	} );
} );
