const proxyquire = require( 'proxyquire' );
const modulePath = '../../../../app/lib/save-user';

let saveUser;
let signSpy;
let user;
let res;
let userCookieName;
let userCookieMaxAge;
let jwtSecret;
let stubs;

describe( 'Saving the user info', function(){

	beforeEach( function(){

		signSpy = jasmine.createSpy( 'jsonwebtoken.sign' );
		user = { some: 'user' };
		res = {
			cookie: jasmine.createSpy( 'res.cookie' )
		};
		userCookieName = 'thecookiename';
		userCookieMaxAge = 1000;
		stubs = {
			'jsonwebtoken': { sign: signSpy  },
			'../config': {
				isDev: false,
				userCookie: { name: userCookieName, maxAge: userCookieMaxAge },
				jwt: { secret: jwtSecret }
			}
		};
	} );

	describe( 'When there is an error signing', function(){

		it( 'Should call next with an error', function( done ){

			saveUser = proxyquire( modulePath, stubs );

			const err = new Error( 'Some error' );

			signSpy.and.callFake( ( req, res, opts, cb ) => { cb( err ); } );

			saveUser( user, res, ( error ) => {

				expect( res.cookie ).not.toHaveBeenCalled();
				expect( error ).toEqual( err );
				done();
			} );
		} );
	} );

	describe( 'When the sign call returns a token', function(){

		let token;
		let sign = {};

		function checkSignCall(){

			expect( sign.user ).toEqual( user );
			expect( sign.secret ).toEqual( jwtSecret );
			expect( sign.opts ).toEqual( {
				algorithm: 'HS256',
				noTimestamp: true
			} );
		}

		beforeEach( function(){

			token = 'abc123';

			signSpy.and.callFake( ( user, secret, opts, cb ) => {

				sign = { user, secret, opts };

				cb( null, token );
			} );
		} );

		describe( 'In dev mode', function(){

			it( 'Should put the user in the cookies as a token without a secure flag', function( done ){

				stubs[ '../config' ].isDev = true;

				saveUser = proxyquire( modulePath, stubs );

				saveUser( user, res, function( err ){

					checkSignCall();

					expect( res.cookie ).toHaveBeenCalledWith( userCookieName, token, {
						httpOnly: true,
						secure: false,
						maxAge: userCookieMaxAge
					} );
					expect( err ).not.toBeDefined();
					done();
				} );
			} );
		} );

		describe( 'Not in dev mode', function(){

			it( 'Should put the user in the cookies as a token with a secure flag', function( done ){

				saveUser = proxyquire( modulePath, stubs );

				saveUser( user, res, function( err ){

					checkSignCall();

					expect( res.cookie ).toHaveBeenCalledWith( userCookieName, token, {
						httpOnly: true,
						secure: true,
						maxAge: userCookieMaxAge
					} );
					expect( err ).not.toBeDefined();
					done();
				} );
			} );
		} );
	} );
} );
