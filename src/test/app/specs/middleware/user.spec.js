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
	let userCookieName;
	let saveUserSpy;

	beforeEach( function(){

		req = { cookies: {} };
		res = { locals: {}, status: () => {} };
		backend = {};
		errorHandler = jasmine.createSpy( 'renderError.createHandler.errorHandler' );
		createHandler = jasmine.createSpy( 'renderError.createHandler' ).and.callFake( () => errorHandler );
		userCookieName = 'aname';
		saveUserSpy = jasmine.createSpy( 'save-user' ).and.callFake( ( user, res, cb ) => { cb(); } );

		const stubs = {
			'../config': { jwt: { secret: jwtSecret }, userCookieName },
			'../lib/service/service.backend': backend,
			'jsonwebtoken': jwt,
			'../lib/render-error': { createHandler },
			'../lib/save-user': saveUserSpy
		};

		middleware = proxyquire( '../../../../app/middleware/user', stubs );
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

			it( 'Should add the user to the req and locals and call saveUser', function( done ){

				middleware( req, res, function next( err ){

					expect( req.user ).toEqual( user );
					expect( res.locals.user ).toEqual( user );
					expect( err ).not.toBeDefined();
					expect( saveUserSpy ).toHaveBeenCalledWith( user, res, next );
					done();
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
						expect( saveUserSpy ).not.toHaveBeenCalled();
						done();
					} );
				} );
			} );
		} );
	} );
} );
