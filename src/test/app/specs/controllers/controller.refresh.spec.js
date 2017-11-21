const proxyquire = require( 'proxyquire' );
const spy = require( '../../helpers/spy' );

const modulePath = '../../../../app/controllers/controller.refresh';

let req;
let res;
let controller;
let backendService;
let saveUser;
let reporter;
let errorHandler;
let userResponse;

describe( 'Refresh controller', function(){

	beforeEach( function(){

		userResponse = { a: 'user' };
		saveUser = spy( 'saveUser' );
		reporter = {
			captureException: spy( 'reporter.captureException' )
		};
		backendService = {
			getUserInfo: spy( 'backendService.getUserInfo' )
		};
		errorHandler =  { createHandler: spy( 'errorHandler.createHandler' ) };

		req = {
			query: {},
			user: { internal: false, experiments: false }
		};

		res = {
			locals: {},
			redirect: spy( 'res.redirect' )
		};

		controller = proxyquire( modulePath, {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler,
			'../lib/save-user': saveUser,
			'../lib/reporter': reporter
		} );
	} );

	describe( 'When the backendService returns a user', function(){

		let promise;

		beforeEach( function(){

			promise = new Promise( ( resolve ) => { resolve( userResponse ); } );

			backendService.getUserInfo.and.callFake( () => promise );
		} );

		describe( 'When save user does not have an error', function(){

			beforeEach( function(){

				saveUser.and.callFake( ( user, res, cb ) => cb() );
			} );

			it( 'Should fetch and save the user and redirect', function( done ){

				controller( req, res );

				promise.then( () => {

					process.nextTick( () => {

						expect( backendService.getUserInfo ).toHaveBeenCalled();
						expect( saveUser ).toHaveBeenCalled();
						expect( saveUser.calls.argsFor( 0 )[ 0 ] ).toEqual( req.user );
						expect( saveUser.calls.argsFor( 0 )[ 1 ] ).toEqual( res );
						expect( res.redirect ).toHaveBeenCalledWith( '/' );
						done();
					} );

				} ).catch( done.fail );

			} );
		} );

		describe( 'When saveUser returns an error', function(){

			it( 'Should report the error and redirect to the return path', function( done ){

				const saveError = new Error( 'saveUser error' );
				saveUser.and.callFake( ( user, res, cb ) => cb( saveError ) );

				controller( req, res );

				promise.then( () => {
					process.nextTick( () => {

						const reporterError = new Error( 'Unable to save user state' );

						expect( backendService.getUserInfo ).toHaveBeenCalled();
						expect( saveUser ).toHaveBeenCalled();
						expect( reporter.captureException ).toHaveBeenCalledWith( reporterError );
						expect( reporter.captureException.calls.argsFor( 0 )[ 0 ].saveError ).toEqual( saveError );
						expect( res.redirect ).toHaveBeenCalledWith( '/' );
						done();
					} );

				} ).catch( done.fail );

			} );
		} );
	} );
} );
