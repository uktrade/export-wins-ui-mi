let proxyquire = require( 'proxyquire' );

const reporterStub = {
	captureException: jasmine.createSpy( 'reporter.captureException' )
};

const configStub = {
	showErrors: false
};

let renderError;
let res;
let req;
let urls;
let urlsResponse;

describe( 'Render Error', function(){

	beforeEach( function(){

		urlsResponse = {};
		urls = jasmine.createSpy( 'urls' ).and.callFake( () => urlsResponse );

		renderError = proxyquire( '../../../../app/lib/render-error', {
			'./reporter': reporterStub,
			'../config': configStub,
			'./urls': urls
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

			beforeEach( function(){

				response = {
					headers: {}
				};

				err = new Error( 'test' );
				err.code = 403;
				err.response = response;
			} );

			describe( 'Without a PreferAuthWith header', function(){

				it( 'Should redirect to the SAML login page', function(){

					handler( err );

					expect( res.redirect ).toHaveBeenCalledWith( '/login-saml/' );
				} );
			} );

			describe( 'With a PreferAuthWith header', function(){

				describe( 'When the header value is saml2', function(){

					it( 'Should redirect to the SAML login page', function(){

						response.headers.preferauthwith = 'saml2';

						handler( err );

						expect( res.redirect ).toHaveBeenCalledWith( '/login-saml/' );
					} );
				} );

				describe( 'When the header value is oauth2', function(){

					it( 'Should redirect to the login page with next specified as the current URL', function(){

						const theUrl = '/my/long/url?with=params';
						urlsResponse = {
							current: () => theUrl
						};
						response.headers.preferauthwith = 'oauth2';

						handler( err );

						expect( urls ).toHaveBeenCalledWith( req );
						expect( res.redirect ).toHaveBeenCalledWith( `/login/?next=${ encodeURIComponent( theUrl ) }` );
					} );
				} );

				describe( 'When the header value is something else', function(){

					it( 'Should redirect to the SAML login page', function(){

						response.headers.preferauthwith = 'test';

						handler( err );

						expect( res.redirect ).toHaveBeenCalledWith( '/login-saml/' );
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
