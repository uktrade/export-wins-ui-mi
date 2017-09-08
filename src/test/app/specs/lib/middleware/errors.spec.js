const proxyquire = require( 'proxyquire' );

describe( 'errors middleware', function(){

	let err;
	let req;
	let res;
	let next;
	let config;
	let middleware;
	let logger;

	beforeEach( function(){

		req = {};
		res = {
			status: jasmine.createSpy( 'res.status' ),
			render: jasmine.createSpy( 'res.render' ),
			sendStatus: jasmine.createSpy( 'res.sendStatus' )
		};
		next = jasmine.createSpy( 'next' );

		config = {
			showErrors: false
		};
		logger = {
			error: jasmine.createSpy( 'logger.error' )
		};

		middleware = proxyquire( '../../../../../app/lib/middleware/errors', {
			'../../config': config,
			'../logger': logger
		} );
	} );

	describe( 'Errors middleware', function(){

		describe( 'catchAll', function(){

			beforeEach( function(){

				err = new Error( 'test' );
			} );

			describe( 'When the headers have been sent', function(){

				it( 'Should call the next handler with the error', function(){

					res.headersSent = true;

					middleware.catchAll( err, req, res, next );

					expect( res.status ).not.toHaveBeenCalled();
					expect( res.render ).not.toHaveBeenCalled();
					expect( logger.error ).toHaveBeenCalled();
					expect( next ).toHaveBeenCalledWith( err );
				} );
			} );

			describe( 'When the headers have not been sent', function(){

				describe( 'A generic error', function(){

					it( 'Should log the error and send a response with the right status code', function(){

						middleware.catchAll( err, req, res, next );

						expect( res.status ).toHaveBeenCalledWith( 500 );
						expect( res.render ).toHaveBeenCalledWith( 'error/default.html', { showErrors: config.showErrors, error: err } );
						expect( logger.error ).toHaveBeenCalled();
						expect( next ).not.toHaveBeenCalled();
					} );
				} );

				describe( 'A TOO_MANY_BYTES error', function(){

					it( 'Should return a 413 status', function(){

						const tooManyBytesError = new Error( 'Too many bytes' );
						tooManyBytesError.code = 'TOO_MANY_BYTES';

						middleware.catchAll( tooManyBytesError, req, res, next );

						expect( res.sendStatus ).toHaveBeenCalledWith( 413 );
						expect( logger.error ).toHaveBeenCalled();
					} );
				} );
			} );
		} );

		describe( '404', function(){

			it( 'Should render the 404 page and send the right status code', function(){

				middleware.handle404( req, res, next );

				expect( res.status ).toHaveBeenCalledWith( 404 );
				expect( res.render ).toHaveBeenCalledWith( 'error/404.html' );
				expect( next ).not.toHaveBeenCalled();
			} );
		} );
	} );
} );
