const proxyquire = require( 'proxyquire' );
const faker = require( 'faker' );

const errorHandler = {};
const backendService = {};
const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

let controller;
let analyticsService;
let mockTracker;
let config;

describe( 'Download controller', function(){

	beforeEach( function(){

		errorHandler.createHandler = jasmine.createSpy( 'createHandler' );
		analyticsService = {
			createTracker: jasmine.createSpy( 'createTracker' ).and.callFake( () => mockTracker )
		};
		config = {
			urls: {
				usingMi: faker.internet.url(),
				kimPrinciples: faker.internet.url(),
				dataWorkspace: {
					index: faker.internet.url(),
					companies: faker.internet.url(),
					contacts: faker.internet.url(),
				}
			}
		};

		controller = proxyquire( '../../../../app/controllers/controller.download', {
			'../lib/service/service.backend': backendService,
			'../lib/service/analytics': analyticsService,
			'../lib/render-error': errorHandler,
			'../config': config
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

		describe( 'With a fdi user param', function(){

			it( 'Should render the correct view', function( done ){

				req.user = { fdi: true };

				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );
				controller.list( req, res );

				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );

				promise.then( ( ) => {

					expect( backendService.getCsvFileList ).toHaveBeenCalledWith( req );
					expect( res.render ).toHaveBeenCalledWith( 'downloads/list', {
						files: fileListResponse,
						showFdi: true,
						usingMiUrl: config.urls.usingMi,
						kimPrinciplesUrl: config.urls.kimPrinciples,
						workspaceUrls: config.urls.dataWorkspace,
					} );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Without an fdi user', function(){

			it( 'Should render the correct view', function( done ){

				req.user = { fdi: false };

				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );
				controller.list( req, res );

				expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );

				promise.then( ( ) => {

					expect( backendService.getCsvFileList ).toHaveBeenCalledWith( req );
					expect( res.render ).toHaveBeenCalledWith( 'downloads/list', {
						files: fileListResponse,
						showFdi: false,
						usingMiUrl: config.urls.usingMi,
						kimPrinciplesUrl: config.urls.kimPrinciples,
						workspaceUrls: config.urls.dataWorkspace,
					} );
					done();

				} ).catch( done.fail );
			} );
		} );
	} );

	describe( 'Download file', function(){

		let fileId;
		let req;
		let res;
		let fileUrlResponse;
		let promise;

		function defaultChecks(){
			expect( backendService.getCsvFileUrl ).toHaveBeenCalledWith( req, fileId );
			expect( res.redirect ).toHaveBeenCalledWith( fileUrlResponse.one_time_url );
		}

		beforeEach( function(){

			fileId = 123;
			req = {
				cookies: { sessionid: '456' },
				params: {
					id: fileId
				},
				query: {},
				url: '/a/path'
			};

			res = {
				redirect: jasmine.createSpy( 'res.redirect' )
			};

			fileUrlResponse = { id: 123, one_time_url: 'https://abc123.com' };

			promise = new Promise( ( resolve ) => resolve( { data: fileUrlResponse } ) );

			backendService.getCsvFileUrl = spy( 'getCsvFileUrl', promise );

		} );

		describe( 'When an analytics tracker is created', function(){

			beforeEach( function(){

				mockTracker = {
					downloadCsvFile: jasmine.createSpy( 'downloadCsvFile' )
				};
			} );

			describe( 'With a name and type query param', function(){

				it( 'Should redirect the user to the CSV url and track the event with the name and type', function( done ){

					req.query = {
						name: 'a name',
						type: 'a type'
					};

					errorHandler.createHandler.and.callFake( createErrorHandler( done ) );
					controller.file( req, res );

					promise.then( () => {

						process.nextTick( () => {

							defaultChecks();
							expect( mockTracker.downloadCsvFile ).toHaveBeenCalledWith( req.url, req.query.type, req.query.name );
							done();
						} );

					} ).catch( done.fail );
				} );
			} );

			describe( 'Without a name and type query param', function(){

				it( 'Should redirect the user to the CSV url and track the event as unknown CSV', function( done ){

					errorHandler.createHandler.and.callFake( createErrorHandler( done ) );
					controller.file( req, res );

					promise.then( () => {

						process.nextTick( () => {

							defaultChecks();
							expect( mockTracker.downloadCsvFile ).toHaveBeenCalledWith( req.url, 'CSV', 'unknown' );
							done();
						} );

					} ).catch( done.fail );
				} );
			} );
		} );

		describe( 'When an analytics tracker is not created', function(){

			it( 'Should not throw an error', function( done ){

				errorHandler.createHandler.and.callFake( createErrorHandler( done ) );
				controller.file( req, res );

				promise.then( () => {

						process.nextTick( () => {

							defaultChecks();
							done();
						} );

					} ).catch( done.fail );
			} );
		} );

		it( 'Should redirect the user to the CSV url', function( done ){

			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.file( req, res );

			expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );

			promise.then( () => {

				process.nextTick( () => {

					defaultChecks();
					done();
				} );

			} ).catch( done.fail );
		} );
	} );
} );
