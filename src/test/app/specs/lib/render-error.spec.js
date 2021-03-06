let proxyquire = require( 'proxyquire' );

const configStub = {
	showErrors: false
};

let reporterStub;
let renderError;
let res;
let req;

describe( 'Render Error', function(){

	beforeEach( function(){

		reporterStub = {
			captureException: jasmine.createSpy( 'reporter.captureException' )
		};

		renderError = proxyquire( '../../../../app/lib/render-error', {
			'./reporter': reporterStub,
			'../config': configStub
		} );
		req = {};
		res = {
			render: jasmine.createSpy( 'res.render' ),
			status: jasmine.createSpy( 'res.status' ),
			redirect: jasmine.createSpy( 'res.redirect' )
		};
	} );

	describe( 'Create handler', function(){

		let handler;

		beforeEach( function(){

			handler = renderError.createHandler( req, res );
		} );

		it( 'Should return a function to handle errors with one parameter', function(){

			expect( typeof handler ).toEqual( 'function' );
			expect( handler.length ).toEqual( 1 );
		} );

		describe( 'Calling the error handler with a 403', function(){

			let err;
			let response;
			let loginPath;

			beforeEach( function(){

				response = {
					headers: {},
					statusCode: 403
				};

				err = new Error( 'test' );
				err.response = response;

				req.originalUrl = '/my/long/url?with=params';

				loginPath = `/login/?next=${ encodeURIComponent( req.originalUrl ) }`;
			} );

			describe( 'Without a PreferAuthWith header', function(){

				it( 'Should redirect to the login page', function(){

					handler( err );

					expect( res.redirect ).toHaveBeenCalledWith( loginPath );
				} );
			} );

			describe( 'With a PreferAuthWith header', function(){

				describe( 'When the header value is saml2', function(){

					it( 'Should redirect to the login page', function(){

						response.headers.preferauthwith = 'saml2';

						handler( err );

						expect( res.redirect ).toHaveBeenCalledWith( loginPath );
					} );
				} );

				describe( 'When the header value is oauth2', function(){

					it( 'Should redirect to the login page with next specified as the current URL', function(){

						response.headers.preferauthwith = 'oauth2';

						handler( err );

						expect( res.redirect ).toHaveBeenCalledWith( loginPath );
					} );
				} );

				describe( 'When the header value is something else', function(){

					it( 'Should redirect to the login page', function(){

						response.headers.preferauthwith = 'test';

						handler( err );

						expect( res.redirect ).toHaveBeenCalledWith( loginPath );
					} );
				} );
			} );
		} );

		describe( 'Calling the error handler without a 403', function(){

			let err;

			beforeEach( function(){

				err = new Error( 'testing' );

				handler( err );
			} );

			it( 'Should report the error', function(){

				expect( reporterStub.captureException ).toHaveBeenCalledWith( err );
			} );

			it( 'Should set the status to 500', function(){

				expect( res.status ).toHaveBeenCalledWith( 500 );
			} );

			it( 'Should render the error page', function(){

				expect( res.render ).toHaveBeenCalledWith( 'error/default.html', { error: err, showErrors: configStub.showErrors } );
			} );
		} );

		describe( 'Calling the error handler with a 404', function(){

			let err;

			beforeEach( function(){

				err = new Error( 'testing' );
				err.response = {
					headers: {},
					statusCode: 404
				};

				handler( err );
			} );

			it( 'Should not report the error', function(){

				expect( reporterStub.captureException ).not.toHaveBeenCalled();
			} );

			it( 'Should set the status to 404', function(){

				expect( res.status ).toHaveBeenCalledWith( 404 );
			} );

			it( 'Should render the 404 page', function(){

				expect( res.render ).toHaveBeenCalledWith( 'error/404.html' );
			} );
		} );
	} );

	describe( 'Send response', function(){

		let err;

		beforeEach( function(){

			err = new Error( 'Test send response' );
			renderError.sendResponse( res, err );
		} );

		it( 'Should log the error', function(){

			expect( reporterStub.captureException ).toHaveBeenCalledWith( err );
		} );

		it( 'Should set the status to 500', function(){

			expect( res.status ).toHaveBeenCalledWith( 500 );
		} );

		it( 'Should render the error page', function(){

			expect( res.render ).toHaveBeenCalledWith( 'error/default.html', { error: err, showErrors: configStub.showErrors } );
		} );
	} );
} );
