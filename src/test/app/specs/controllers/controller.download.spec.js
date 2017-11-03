const proxyquire = require( 'proxyquire' );

const errorHandler = {};
const backendService = {};
const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

let controller;

describe( 'Download controller', function(){

	beforeEach( function(){

		errorHandler.createHandler = jasmine.createSpy( 'createHandler' );

		controller = proxyquire( '../../../../app/controllers/controller.download', {
			'../lib/service/service.backend': backendService,
			'../lib/render-error': errorHandler
		} );
	} );

	describe( 'Handler', function(){

		it( 'Should redirect the user to the CSV url', function( done ){

			const req = {
				cookies: { sessionid: '456' },
				year: 2017
			};

			const res = {
				redirect: jasmine.createSpy( 'res.redirect' )
			};

			const fileListResponse = { id: 123, created: 'abc123' };
			const fileUrlResponse = { id: 123, one_time_url: 'https://abc123.com' };

			const promise1 = new Promise( ( resolve ) => resolve( { data: fileListResponse } ) );
			const promise2 = new Promise( ( resolve ) => resolve( { data: fileUrlResponse } ) );

			backendService.getCsvFileList = spy( 'getCsvFileList', promise1 );
			backendService.getCsvFileUrl = spy( 'getCsvFileUrl', promise2 );

			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.csv( req, res );

			expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );

			promise1.catch( done.fail );
			promise2.then( () => {

				process.nextTick( () => {

				expect( backendService.getCsvFileList ).toHaveBeenCalledWith( req );
				expect( backendService.getCsvFileUrl ).toHaveBeenCalledWith( req, fileListResponse.id );
					expect( res.redirect ).toHaveBeenCalledWith( fileUrlResponse.one_time_url );
					done();
				} );

			} ).catch( done.fail );
		} );
	} );
} );
