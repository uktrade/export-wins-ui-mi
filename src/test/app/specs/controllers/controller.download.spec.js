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

	describe( 'List downloads', function(){

		let req;
		let res;
		let fileListResponse;
		let promise;

		beforeEach( function(){

			req = {
				query: {}
			};
			res = {
				render: jasmine.createSpy( 'res.render' )
			};

			fileListResponse = { id: 123, created: 'abc123' };
			promise = new Promise( ( resolve ) => resolve( { data: fileListResponse } ) );

			backendService.getCsvFileList = spy( 'getCsvFileList', promise );
		} );

		describe( 'With a ?fdi=1 query param', function(){

			it( 'Should render the correct view', function( done ){

				req.query.fdi = '1';

				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );
				controller.list( req, res );

				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );

				promise.then( ( ) => {

					expect( backendService.getCsvFileList ).toHaveBeenCalledWith( req );
					expect( res.render ).toHaveBeenCalledWith( 'downloads/list', { files: fileListResponse, showFdi: true } );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Without any query params', function(){

			it( 'Should render the correct view', function( done ){

				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );
				controller.list( req, res );

				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );

				promise.then( ( ) => {

					expect( backendService.getCsvFileList ).toHaveBeenCalledWith( req );
					expect( res.render ).toHaveBeenCalledWith( 'downloads/list', { files: fileListResponse, showFdi: false } );
					done();

				} ).catch( done.fail );
			} );
		} );
	} );

	describe( 'Download file', function(){

		it( 'Should redirect the user to the CSV url', function( done ){

			const fileId = 123;
			const req = {
				cookies: { sessionid: '456' },
				params: {
					id: fileId
				}
			};

			const res = {
				redirect: jasmine.createSpy( 'res.redirect' )
			};

			const fileUrlResponse = { id: 123, one_time_url: 'https://abc123.com' };

			const promise = new Promise( ( resolve ) => resolve( { data: fileUrlResponse } ) );

			backendService.getCsvFileUrl = spy( 'getCsvFileUrl', promise );

			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.file( req, res );

			expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );

			promise.then( () => {

				process.nextTick( () => {

					expect( backendService.getCsvFileUrl ).toHaveBeenCalledWith( req, fileId );
					expect( res.redirect ).toHaveBeenCalledWith( fileUrlResponse.one_time_url );
					done();
				} );

			} ).catch( done.fail );
		} );
	} );
} );
