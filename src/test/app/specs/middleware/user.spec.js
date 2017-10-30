const proxyquire = require( 'proxyquire' );
const jwt = require( 'jsonwebtoken' );

const jwtSecret = 'secret';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
const user = {
	"sub": "1234567890",
	"name": "John Doe",
	"admin": true
};

describe( 'user middleware', function(){

	let req;
	let res;
	let middleware;
	let backend;
	let createHandler;
	let errorHandler;
	let createMiddleware;
	let userCookieName;

	beforeEach( function(){

		req = { cookies: {} };
		res = { locals: {}, status: () => {} };
		backend = {};
		errorHandler = jasmine.createSpy( 'renderError.createHandler.errorHandler' );
		createHandler = jasmine.createSpy( 'renderError.createHandler' ).and.callFake( () => errorHandler );
		userCookieName = 'aname';

		const stubs = {
			'../config': { jwt: { secret: jwtSecret }, userCookieName },
			'../lib/service/service.backend': backend,
			'jsonwebtoken': jwt,
			'../lib/render-error': { createHandler }
		};

		createMiddleware = proxyquire( '../../../../app/middleware/user', stubs );
		middleware = createMiddleware( false );
	} );

	describe( 'When there is a token', function(){

		describe( 'When the token can be decrypted', function(){

			it( 'Should set the user in the req', function( done ){

				req.cookies[ userCookieName ] = token;

				middleware( req, res, function(){

					expect( req.user ).toEqual( user );
					expect( res.locals.user ).toEqual( user );
					done();
				} );
			} );
		} );

		describe( 'When the token cannot be decrypted', function(){

			it( 'Should show an error page', function( done ){

				req.cookies[ userCookieName ] = 'notvalid';

				middleware( req, res, function( err ){

					expect( err ).toBeDefined();
					done();
				} );
			} );
		} );
	} );

	describe( 'When there is not a token', function(){

		describe( 'When the API returns a user', function(){

			let promise;

			beforeEach( function(){

				promise = new Promise( ( resolve ) => {

					resolve( user );
				} );

				res.cookie = jasmine.createSpy( 'res.cookie' );

				backend.getUserInfo = jasmine.createSpy( 'backend.getUserInfo' ).and.callFake( () => promise );
			} );

			it( 'Should add the user to the req and locals', function( done ){

				middleware( req, res, function( err ){

					expect( req.user ).toEqual( user );
					expect( res.locals.user ).toEqual( user );
					expect( err ).not.toBeDefined();
					done();
				} );
			} );

			describe( 'When the sign call returns a token', function(){

				describe( 'In dev mode', function(){

					it( 'Should put the user in the cookies as a token without a secure flag', function( done ){

						middleware = createMiddleware( true );

						middleware( req, res, function( err ){

							expect( res.cookie ).toHaveBeenCalledWith( userCookieName, token, {
								httpOnly: true,
								secure: false,
								expires: 0
							} );
							expect( err ).not.toBeDefined();
							done();
						} );
					} );
				} );

				describe( 'Not in dev mode', function(){

					it( 'Should put the user in the cookies as a token with a secure flag', function( done ){

						middleware( req, res, function( err ){

							expect( res.cookie ).toHaveBeenCalledWith( userCookieName, token, {
								httpOnly: true,
								secure: true,
								expires: 0
							} );
							expect( err ).not.toBeDefined();
							done();
						} );
					} );
				} );
			} );

			describe( 'When the sign call returns an error', function(){

				it( 'Should pass the error on', function( done ){

					const signError = new Error( 'unable to sign' );

					jwt.sign = function( data, secret, opts, cb ){
						cb( signError );
					};

					middleware( req, res, function( err ){

						expect( err ).toEqual( signError );
						done();
					} );
				} );
			} );
		} );

		describe( 'When the API returns an error', function(){

			let promise;
			let err;
			let next;

			beforeEach( function(){

				promise = new Promise( ( resolve, reject ) => {

					err = new Error( 'No user found' );

					reject( err );
				} );

				next = jasmine.createSpy( 'next' );

				res.render = jasmine.createSpy( 'res.render' );

				backend.getUserInfo = jasmine.createSpy( 'backend.getUserInfo' ).and.callFake( () => promise );
			} );

			it( 'Should show an error page', function( done ){

				middleware( req, res, next );

				expect( createHandler ).toHaveBeenCalledWith( req, res );

				promise.catch( () => {

					process.nextTick( () => {

						expect( next ).not.toHaveBeenCalled();
						expect( errorHandler ).toHaveBeenCalledWith( err );
						done();
					} );
				} );
			} );
		} );
	} );
} );
