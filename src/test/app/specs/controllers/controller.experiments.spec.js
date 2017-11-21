const proxyquire = require( 'proxyquire' );
const spy = require( '../../helpers/spy' );

const modulePath = '../../../../app/controllers/controller.experiments';

let req;
let res;
let controller;
let saveUser;
let safePath;
let spyPath;
let reporter;

describe( 'Experiments controller', function(){

	beforeEach( function(){

		spyPath = 'abc123';
		saveUser = jasmine.createSpy( 'saveUser' );
		safePath = spy( 'safePath', spyPath );
		reporter = {
			captureException: jasmine.createSpy( 'reporter.captureException' )
		};

		req = {
			query: {},
			user: { internal: false, experiments: false }
		};

		res = {
			redirect: jasmine.createSpy( 'res.redirect' )
		};

		controller = proxyquire( modulePath, {
			'../lib/save-user': saveUser,
			'../lib/safe-path': safePath,
			'../lib/reporter': reporter
		} );
	} );

	describe( 'When the user is in the internal users group', function(){

		beforeEach( function(){

			req.user.internal = true;
		} );

		describe( 'When save error does not have an error', function(){

			beforeEach( function(){

				saveUser.and.callFake( ( user, res, cb ) => cb() );
			} );

			describe( 'When experiments is set to false', function(){

				it( 'Should save the user with experiments set to true and redirect', function( done ){

					controller( req, res );

					process.nextTick( () => {

						expect( req.user.experiments ).toEqual( true );
						expect( saveUser ).toHaveBeenCalled();
						expect( res.redirect ).toHaveBeenCalledWith( spyPath );
						done();
					} );
				} );
			} );

			describe( 'When experiments is set to true', function(){

				it( 'Should save the user with experiments set to false and redirect', function( done ){

					req.user.experiments = true;

					controller( req, res );

					process.nextTick( () => {

						expect( req.user.experiments ).toEqual( false );
						expect( saveUser ).toHaveBeenCalled();
						expect( res.redirect ).toHaveBeenCalledWith( spyPath );
						done();
					} );
				} );
			} );
		} );


		describe( 'When saveUser returns an error', function(){

			it( 'Should report the error and redirect to the return path', function( done ){

				const saveError = new Error( 'saveUser error' );
				saveUser.and.callFake( ( req, res, cb ) => cb( saveError ) );

				controller( req, res );

				process.nextTick( () => {

					const reporterError = new Error( 'Unable to save experiments state' );

					expect( saveUser ).toHaveBeenCalled();
					expect( reporter.captureException ).toHaveBeenCalledWith( reporterError );
					expect( reporter.captureException.calls.argsFor( 0 )[ 0 ].saveError ).toEqual( saveError );
					expect( res.redirect ).toHaveBeenCalledWith( spyPath );
					done();
				} );
			} );
		} );
	} );

	describe( 'When the user is NOT in the internal users group', function(){

		it( 'Should redirect to the return path', function(){

			const returnPath = '/my-test/';
			req.query.path = returnPath;

			controller( req, res );

			expect( safePath ).toHaveBeenCalledWith( returnPath );
			expect( saveUser ).not.toHaveBeenCalled();
			expect( res.redirect ).toHaveBeenCalledWith( spyPath );
		} );
	} );
} );
