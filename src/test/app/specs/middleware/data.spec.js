const EventEmitter = require( 'events' );
const middleware = require( '../../../../app/middleware/data' );

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

	describe( 'When the payload byte size is over 50000', function(){

		it( 'Should call removeListener and call next with an error', function( done ){

			const removeListenerSpy = jasmine.createSpy( 'removeListener' );
			const chunk25 = 'abcdefghijklmnopqrstuvwxy';//25
			let chunk1000;
			let i = 0;

			do {

				chunk1000 += chunk25;
				i +=1;

			} while( i < 40 );

			req.removeListener = removeListenerSpy;

			middleware( req, res, ( err ) => {

				expect( err ).toEqual( new Error( 'Too many bytes' ) );
				expect( err.code ).toEqual( 'TOO_MANY_BYTES' );
				expect( removeListenerSpy ).toHaveBeenCalled();
				done();
			} );

			i = 0;
			do {

				req.emit( 'data', chunk1000 );
				i += 1;

			} while( i < 55 );

			//req.emit( 'end' );
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
