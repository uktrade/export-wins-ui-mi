const proxyquire = require( 'proxyquire' );

const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

let controller;
let errorHandler;
let backendService;
let reporter;
let res;
let req;
let config;
let getRedirectUri;

describe( 'Login controller', function(){

	const datahubDomain = 'abc.com';
	const redirectUri = "http://example.com/login/callback/";

	beforeEach( function(){

		backendService = {};
		errorHandler = {
			createHandler: spy( 'createHandler' )
		};
		reporter = {
			captureException: spy( 'reporter.captureException' )
		};

		config = {
			oauthParamLength: 8,
			userCookie: { name: 'aname' },
			isDev: false,
			datahubDomain
		};

		req = {
			cookies: 'test',
			get: function(key) { return key;},
			query: {}
		};
		res = {
			status: spy( 'res.status' ),
			set: spy( 'res.set' ),
			render: spy( 'res.render' ),
			redirect: spy( 'res.redirect' ),
			clearCookie: spy( 'res.clearCookie' )
		};

		getRedirectUri = spy('getRedirectUri', redirectUri);

		controller = proxyquire( '../../../../app/controllers/controller.login', {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../lib/reporter': reporter,
			'../config': config,
			'../lib/get-redirect-uri': getRedirectUri
		} );
	} );

	function createClearCookieStr( name ){

		const parts = [
			`${ name }=`,
			'HttpOnly',
			'Path=/',
			`Expires=${ ( new Date( 1 ) ).toGMTString() }`
		];

		if( !config.isDev ){

			parts.push( 'Secure' );
		}

		return parts.join( '; ' );
	}

	function createClearUserCookie(){

		return createClearCookieStr( config.userCookie.name );
	}

	describe( 'OAuth login', function(){

		describe( 'With a success response', function(){

			describe( 'With a json response', function(){

				let json;
				let promise;

				beforeEach( function(){

					json = {
						target_url: 'https://localhost:2000/o/authorize/?response_type=code&client_id=some-id&redirect_uri=http%3A%2F%2Flocalhost%3A9001%2F&state=abcd1234'
					};
					promise = new Promise( ( resolve ) => resolve( { response: {}, data: json } ) );

					backendService.getOauthUrl = spy( 'getOauthUrl', promise );
				} );

				describe( 'Without a next param', function(){

					it( 'Should get the login url and redirect to it', function( done ){

						controller.oauth( req, res );

						promise.then( () => {

							expect( backendService.getOauthUrl ).toHaveBeenCalled();
							expect( errorHandler.createHandler ).not.toHaveBeenCalled();
							expect( res.set ).toHaveBeenCalledWith( 'Set-Cookie', [ createClearUserCookie() ] );
							expect( getRedirectUri ).toHaveBeenCalledWith( req );
							expect( res.redirect ).toHaveBeenCalledWith( json.target_url );
							done();
						} );
					} );
				} );

				describe( 'With a next URL param', function(){

					it( 'Should pass the param to the backend', function(){

						req.query = {
							next: '/my/path/'
						};

						const promise = new Promise( ( resolve ) => resolve( { response: {}, data: null } ) );

						backendService.getOauthUrl = spy( 'getOauthUrl', promise );
						controller.oauth( req, res );

						expect( backendService.getOauthUrl ).toHaveBeenCalledWith( req.query.next, redirectUri );
					} );
				} );
			} );

			describe( 'Without a json response', function(){

				it( 'Should throw an error', function( done ){

					const err = new Error( 'No target_url' );
					const promise = new Promise( ( resolve ) => resolve( { response: {}, data: null } ) );

					backendService.getOauthUrl = spy( 'getOauthUrl', promise );

					controller.oauth( req, res );

					promise.then( () => {
						process.nextTick( () => {

							expect( res.status ).toHaveBeenCalledWith( 500 );
							expect( res.render ).toHaveBeenCalledWith( 'error/unable-to-login.html' );
							expect( reporter.captureException ).toHaveBeenCalledWith( err );
							done();
						} );
					} );
				} );
			} );
		} );

		describe( 'With a fail response', function(){

			it( 'Should render an error page', async function(){

				const err = new Error( 'fail response' );
				const promise = new Promise( ( resolve, reject ) => reject( err ) );
				backendService.getOauthUrl = spy( 'getOauthUrl', promise );

				await controller.oauth( req, res );

				expect( res.status ).toHaveBeenCalledWith( 500 );
				expect( res.render ).toHaveBeenCalledWith( 'error/unable-to-login.html' );
				expect( reporter.captureException ).toHaveBeenCalledWith( err );
			} );
		} );
	} );

	describe( 'oauthCallback', function(){

		describe( 'With error param', function(){

			beforeEach( function(){

				req.query = { error: 'something' };
			} );

			it( 'Should render the unable-to-login page', function(){

				const err = new Error( 'oAuth callback error' );

				controller.oauthCallback( req, res );

				expect( res.status ).toHaveBeenCalledWith( 500 );
				expect( res.render ).toHaveBeenCalledWith( 'error/unable-to-login.html' );
				expect( reporter.captureException ).toHaveBeenCalledWith( err );
				expect( reporter.captureException.calls.argsFor( 0 )[ 0 ].param ).toEqual( req.query.error );
			} );
		} );

		describe( 'With code and state params', function(){

			beforeEach( function(){

				req.query = {
					code: 'acode',
					state: 'astate'
				};
			} );

			describe( 'With a success response', function(){

				describe( 'With valid params', function(){

					const response = {
						headers: {
							'set-cookie': [ 'abc=test', 'sessionid=1234' ]
						}
					};

					describe( 'With a JSON response', function(){

						it( 'Should redirect to the next location from the JSON', function( done ){

							const next = '/my/url/';
							const promise = new Promise( ( resolve ) => resolve( { response, data: { next } } ) );

							backendService.postOauthCallback = spy( 'postOauthCallback', promise );

							controller.oauthCallback( req, res );

							promise.then( () => {

								expect( backendService.postOauthCallback ).toHaveBeenCalledWith( `code=${ req.query.code }&state=${ req.query.state }&redirect_uri=${encodeURIComponent(redirectUri)}` );
								expect( res.set ).toHaveBeenCalledWith( 'Set-Cookie', [ response.headers[ 'set-cookie' ][ 1 ] ] );
								expect( res.redirect ).toHaveBeenCalledWith( next );
								done();
							} );
						} );
					} );

					describe( 'Without a JSON response', function(){

						it( 'Should call the backend service and pass the params as JSON', function( done ){

							const promise = new Promise( ( resolve ) => resolve( { response, data: '' } ) );

							backendService.postOauthCallback = spy( 'postOauthCallback', promise );

							controller.oauthCallback( req, res );

							promise.then( () => {

								expect( backendService.postOauthCallback ).toHaveBeenCalledWith( `code=${ req.query.code }&state=${ req.query.state }&redirect_uri=${encodeURIComponent(redirectUri)}` );
								expect( res.set ).toHaveBeenCalledWith( 'Set-Cookie', [ response.headers[ 'set-cookie' ][ 1 ] ] );
								expect( res.redirect ).toHaveBeenCalledWith( '/' );
								done();
							} );
						} );
					} );
				} );

				describe( 'With invalid params', function(){

					const invalidParamsError = new Error( 'Invalid oauth params' );

					describe( 'Without a code or state', function(){

						it( 'Shouls throw an invalid params error', function(){

							req.query = {};
							expect( () => controller.oauthCallback( req, res ) ).toThrow( invalidParamsError );
						} );
					} );

					describe( 'When they are too long', function(){

						describe( 'When the code is too long', function(){

							it( 'Should throw an invalid params error', function(){

								req.query.code = 'abcdefghijklkmnop';
								expect( () => controller.oauthCallback( req, res ) ).toThrow( invalidParamsError );
							} );
						} );

						describe( 'When the state is too long', function(){

							it( 'Should throw an invalid params error', function(){

								req.query.state = 'abcdefghijklkmnop';
								expect( () => controller.oauthCallback( req, res ) ).toThrow( invalidParamsError );
							} );
						} );
					} );

					describe( 'When the are not alphanumeric', function(){

						describe( 'When the code is node valid', function(){

							it( 'Should throw an invalid params error', function(){

								req.query.code = 'a b c';
								expect( () => controller.oauthCallback( req, res ) ).toThrow( invalidParamsError );
							} );
						} );

						describe( 'When the state is node valid', function(){

							it( 'Should throw an invalid params error', function(){

								req.query.state = 'a b c';
								expect( () => controller.oauthCallback( req, res ) ).toThrow( invalidParamsError );
							} );
						} );
					} );
				} );
			} );

			describe( 'With any other response', function(){

				it( 'Should render the unable to login page', async function(){

					const e = new Error( 'something' );

					const promise = new Promise( ( resolve, reject ) => reject( e ) );

					backendService.postOauthCallback = spy( 'postOauthCallback', promise );

					await controller.oauthCallback( req, res );

					expect( res.status ).toHaveBeenCalledWith( 500 );
					expect( res.render ).toHaveBeenCalledWith( 'error/unable-to-login.html' );
					expect( reporter.captureException ).toHaveBeenCalledWith( e );
				} );
			} );
		} );
	} );

	describe( 'Signout', function(){

		it( 'Should delete the cookie and redirect', function(){

			controller.signout( req, res );

			expect( res.set ).toHaveBeenCalledWith( 'Set-Cookie', [ createClearCookieStr( 'sessionid' ) ] );
			expect( res.redirect ).toHaveBeenCalledWith( `${ datahubDomain }/oauth/sign-out` );
		} );
	} );
} );
