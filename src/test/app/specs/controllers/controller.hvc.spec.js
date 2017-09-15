const proxyquire = require( 'proxyquire' );

const createErrorHandler = require( '../../helpers/create-error-handler' );
const getBackendStub = require( '../../helpers/get-backend-stub' );
const spy = require( '../../helpers/spy' );

let viewModel;
let exportBackendService;
let errorHandler;
let sortWins;
let sortWinsResponse;

let hvcDetail;
let topMarkets;

let topMaketsModel;

let res;
let controller;

describe( 'HVC controller', function(){

	beforeEach( function(){

		sortWinsResponse = { some: 'wins' };

		exportBackendService = {};
		viewModel = {};
		sortWins = spy( 'sortWins', sortWinsResponse );
		topMaketsModel = { test: 1 };

		hvcDetail = {
			create: spy( 'view-models.hvc-detail.create', viewModel )
		};
		topMarkets = {
			create: spy( 'view-models.top-markets.create', topMaketsModel )
		};
		res = {
			render: spy( 'res.render' )
		};
		errorHandler = {
			createHandler: spy( 'createHandler' )
		};

		controller = proxyquire( '../../../../app/controllers/controller.hvc', {
			'../lib/service/service.backend': { export: exportBackendService },
			'../lib/render-error': errorHandler,
			'../lib/sort-wins': sortWins,
			'../lib/view-models/hvc-detail': hvcDetail,
			'../lib/view-models/top-markets': topMarkets
		} );
	} );

	describe( 'Detail', function(){

		it( 'Should get the HVC data and render the correct view', function( done ){

			const hvcData = getBackendStub( '/hvc/hvc' );
			const hvcMarkets = getBackendStub( '/hvc/markets' );
			const hvcId = 1234;
			const req = {
				params: {
					id: hvcId
				}
			};

			let promise = new Promise( ( resolve ) => {

				resolve( { hvc: hvcData, markets: hvcMarkets } );
			} );

			exportBackendService.getHvcInfo = spy( 'getHvcInfo', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.hvc( req, res );

			promise.then( function(){

				expect( exportBackendService.getHvcInfo ).toHaveBeenCalledWith( req, hvcId );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( hvcDetail.create ).toHaveBeenCalledWith( hvcData );
				expect( topMarkets.create ).toHaveBeenCalledWith( hvcMarkets );

				expect( res.render ).toHaveBeenCalledWith( 'hvc/detail.html', viewModel );
				expect( viewModel.topMarkets ).toEqual( topMaketsModel );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				done();
			} );
		} );
	} );

	describe( 'Win List', function(){

		it( 'Should get the list of HVC wins and render the correct view', function( done ){

			const hvcId = 1234;
			const sort = { some: 'sort', params: true };
			const req = {
				params: {
					id: hvcId
				},
				query: { sort }
			};

			const hvcWins = {
				date_range: { start: 6, end: 9 },
				results: {
					hvc: { test: 1 },
					wins: {
						hvc: [ 'some HVC wins' ]
					}
				}
			};

			let promise = new Promise( ( resolve ) => {

				resolve( hvcWins );
			} );

			exportBackendService.getHvcWinList = spy( 'getHvcWinList', promise );
			errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.winList( req, res );

			promise.then( function(){

				expect( exportBackendService.getHvcWinList ).toHaveBeenCalledWith( req, hvcId );
				expect( errorHandler.createHandler ).toHaveBeenCalled();
				expect( sortWins ).toHaveBeenCalledWith( hvcWins.results.wins.hvc, sort );
				expect( res.render ).toHaveBeenCalledWith( 'hvc/wins.html', {
					dateRange: hvcWins.date_range,
					hvc: hvcWins.results.hvc,
					wins: sortWinsResponse
				} );
				done();
			} );
		} );
	} );
} );
