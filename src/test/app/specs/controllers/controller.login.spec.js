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

describe( 'Login controller', function(){

	beforeEach( function(){

		backendService = {};
		errorHandler = {
			createHandler: spy( 'createHandler' )
		};
		reporter = {
			captureException: spy( 'reporter.captureException' )
		};

		config = { oauthParamLength: 8, userCookieName: 'aname', isDev: false  };

		req = {
			cookies: 'test'
		};
		res = {
			set: spy( 'res.set' ),
			render: spy( 'res.render' ),
			redirect: spy( 'res.redirect' ),
			clearCookie: spy( 'res.clearCookie' )
		};

		controller = proxyquire( '../../../../app/controllers/controller.login', {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../lib/reporter': reporter,
			'../config': config
		} );
	} );

	function createClearUserCookie(){

		const parts = [
			`${ config.userCookieName }=`,
			'HttpOnly',
			'Path=/',
			`Expires=${ ( new Date( 1 ) ).toGMTString() }`
		];

		if( !config.isDev ){

			parts.push( 'Secure' );
		}

		return parts.join( '; ' );
	}

	describe( 'OAuth login', function(){

		describe( 'With a json response', function(){

			it( 'Should get the login url and redirect to it', function( done ){

				const json = {
					target_url: 'https://localhost:2000/o/authorize/?response_type=code&client_id=some-id&redirect_uri=http%3A%2F%2Flocalhost%3A9001%2F&state=abcd1234'
				};

				const promise = new Promise( ( resolve ) => resolve( { response: {}, data: json } ) );

				backendService.getOauthUrl = spy( 'getOauthUrl', promise );
				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

				controller.oauth( req, res );

				promise.then( () => {

					expect( backendService.getOauthUrl ).toHaveBeenCalled();
					expect( errorHandler.createHandler ).toHaveBeenCalledWith( res );
					expect( res.set ).toHaveBeenCalledWith( 'Set-Cookie', [ createClearUserCookie() ] );
					expect( res.redirect ).toHaveBeenCalledWith( json.target_url );
					done();
				} );
			} );
		} );

		/*
		describe( 'Without a json response', function(){

			it( 'Should throw an error', function( done ){

				const errHandler = jasmine.createSpy( 'errHandler' );
				const promise = new Promise( ( resolve ) => resolve( { response: {}, data: null } ) );

				backendService.getOauthUrl = spy( 'getOauthUrl', promise );
				errorHandler.createHandler.and.callFake( () => errHandler );

				controller.oauth( req, res );

				process.nextTick( () => {

					expect( errHandler ).toHaveBeenCalled();
					done();
				} );
			} );
		} );
		*/
	} );

	describe( 'oauthCallback', function(){

		beforeEach( function(){

			req.query = {
				code: 'acode',
				state: 'astate'
			};
		} );

		describe( 'With a success response', function(){

			describe( 'With valid params', function(){

				it( 'Should call the backend service and pass the params as JSON', function( done ){

					const response = {
						headers: {
							'set-cookie': [ 'abc=test', 'sessionid=1234' ]
						}
					};

					const promise = new Promise( ( resolve ) => resolve( { response, data: 'success' } ) );

					backendService.postOauthCallback = spy( 'postOauthCallback', promise );
					errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

					controller.oauthCallback( req, res );

					promise.then( () => {

						expect( backendService.postOauthCallback ).toHaveBeenCalledWith( `code=${ req.query.code }&state=${ req.query.state }` );
						expect( res.set ).toHaveBeenCalledWith( 'Set-Cookie', [ response.headers[ 'set-cookie' ][ 1 ] ] );
						expect( res.redirect ).toHaveBeenCalledWith( '/' );
						done();
					} );
				} );
			} );

			describe( 'With invalid params', function(){

				const invalidParamsError = new Error( 'Invalid oauth params' );

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

			it( 'Should render the unable to login page', function( done ){

				const e = new Error( 'something' );

				const promise = new Promise( ( resolve, reject ) => reject( e ) );

				backendService.postOauthCallback = spy( 'postOauthCallback', promise );

				controller.oauthCallback( req, res );

				process.nextTick( () => {

					expect( res.render ).toHaveBeenCalledWith( 'error/unable-to-login.html' );
					expect( reporter.captureException ).toHaveBeenCalledWith( e );
					done();
				} );
			} );
		} );
	} );

	describe( 'Saml Login', function(){

		it( 'Should get the login token and render the view', function( done ){

			const token = 'test response';
			const response = {
				headers: {
					'set-cookie': [ 'abc', 'sessionid=123456' ]
				}
			};
			const promise = new Promise( ( resolve ) => { resolve( { response, data: token } ); } );

			backendService.getSamlLogin = spy( 'getSamlLogin', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.saml( req, res );

			promise.then( () => {

				expect( backendService.getSamlLogin ).toHaveBeenCalledWith( req );
				expect( res.set ).toHaveBeenCalledWith( 'Set-Cookie', [ 'sessionid=123456', createClearUserCookie() ] );
				expect( res.render ).toHaveBeenCalledWith( 'login.html', { token } );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} );
		} );
	} );
} );
