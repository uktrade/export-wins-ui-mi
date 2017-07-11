const proxyquire = require( 'proxyquire' );

const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

let controller;
let errorHandler;
let backendService;
let res;
let req;

describe( 'Login controller', function(){

	beforeEach( function(){

		backendService = {};
		errorHandler = {
			createHandler: spy( 'createHandler' )
		};

		req = {
			cookies: 'test'
		};
		res = {
			set: spy( 'res.set' ),
			render: spy( 'res.render' )
		};

		controller = proxyquire( '../../../../app/controllers/controller.login', {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler
		} );
	} );

	describe( 'Login', function(){

		it( 'Should get the login token and render the view', function( done ){

			const token = 'test response';
			const response = {
				headers: {
					'set-cookie': [ 'abc' ]
				}
			};
			const promise = new Promise( ( resolve ) => { resolve( { response, data: token } ); } );

			backendService.getSamlLogin = spy( 'getSamlLogin', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller( req, res );

			promise.then( () => {
				expect( backendService.getSamlLogin ).toHaveBeenCalledWith( req );
				expect( res.set ).toHaveBeenCalledWith( 'Set-Cookie', response.headers[ 'set-cookie' ] );
				expect( res.render ).toHaveBeenCalledWith( 'login.html', { token } );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} );
		} );
	} );
} );
