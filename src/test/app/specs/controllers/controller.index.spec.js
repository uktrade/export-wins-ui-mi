const proxyquire = require( 'proxyquire' );

const errorHandler = {};
const exportBackendService = {};
const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

let controller;
let globalSummary;
let globalSummaryData;

describe( 'Index controller', function(){

	beforeEach( function(){

		globalSummaryData = { globalSummaryData: true };
		errorHandler.createHandler = jasmine.createSpy( 'createHandler' );
		globalSummary = { create: spy( 'globalSummary.create', globalSummaryData ) };

		controller = proxyquire( '../../../../app/controllers/controller.index', {
			'../lib/service/service.backend': { export: exportBackendService },
			'../lib/render-error': errorHandler,
			'../lib/view-models/global-summary': globalSummary
		} );
	} );

	describe( 'Handler', function(){

		let req;
		let res;
		let sectorTeams;
		let overseasRegionGroups;
		let ukRegions;
		let globalHvcs;
		let globalWins;
		let promise;

		beforeEach( function(){

			req = {
				cookies: { sessionid: '456' },
				query: {},
				year: 2017
			};

			res = {
				render: jasmine.createSpy( 'res.render' )
			};

			sectorTeams = { results: { sectorTeams: true } };
			overseasRegionGroups = { results: { overseasRegionGroups: true } };
			ukRegions = { results: { ukRegions: true } };
			globalHvcs = { results: { globalHvcs: true } };
			globalWins = { date_range: { test: 1 }, results: { globalWins: true } };

			promise = new Promise( ( resolve ) => {

				resolve( {
					sectorTeams,
					overseasRegionGroups,
					ukRegions,
					globalHvcs,
					globalWins
				} );
			} );

			exportBackendService.getHomepageData = spy( 'getHomepageData', promise );
		} );

		describe( 'In the default year', function(){

			beforeEach( function(){

				req.isDefaultYear = true;
			} );

			describe( 'Without any query params', function(){

				it( 'Should render the view with the corect data', function( done ){

					errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

					controller( req, res );

					promise.then( () => {

						expect( exportBackendService.getHomepageData ).toHaveBeenCalledWith( req );
						expect( globalSummary.create ).toHaveBeenCalledWith( globalWins );
						expect( res.render ).toHaveBeenCalledWith( 'index.html', {
							sectorTeams: sectorTeams.results,
							overseasRegionGroups: overseasRegionGroups.results,
							ukRegions: ukRegions.results,
							globalHvcs: globalHvcs.results,
							summary: globalSummaryData,
							showDownloadLink: false
						} );
						expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
						done();
					} );
				} );
			} );

			describe( 'With ?download=true', function(){

				it( 'Should set showDownloadLink to true', function( done ){

					req.query.download = '1';

					errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

					controller( req, res );

					promise.then( () => {

						expect( exportBackendService.getHomepageData ).toHaveBeenCalledWith( req );
						expect( globalSummary.create ).toHaveBeenCalledWith( globalWins );
						expect( res.render ).toHaveBeenCalledWith( 'index.html', {
							sectorTeams: sectorTeams.results,
							overseasRegionGroups: overseasRegionGroups.results,
							ukRegions: ukRegions.results,
							globalHvcs: globalHvcs.results,
							summary: globalSummaryData,
							showDownloadLink: true
						} );
						expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
						done();
					} );
				} );
			} );
		} );

		describe( 'Not in the default year', function(){

			beforeEach( function(){

				req.isDefaultYear = false;
			} );

			describe( 'Without any query params', function(){

				it( 'Should set showDownloadLink to false', function( done ){

					errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

					controller( req, res );

					promise.then( () => {

						expect( exportBackendService.getHomepageData ).toHaveBeenCalledWith( req );
						expect( globalSummary.create ).toHaveBeenCalledWith( globalWins );
						expect( res.render ).toHaveBeenCalledWith( 'index.html', {
							sectorTeams: sectorTeams.results,
							overseasRegionGroups: overseasRegionGroups.results,
							ukRegions: ukRegions.results,
							globalHvcs: globalHvcs.results,
							summary: globalSummaryData,
							showDownloadLink: false
						} );
						expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
						done();
					} );
				} );
			} );

			describe( 'With ?download=1', function(){

				it( 'Should set showDownloadLink to false', function( done ){

					req.query.download = '1';

					errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

					controller( req, res );

					promise.then( () => {

						expect( exportBackendService.getHomepageData ).toHaveBeenCalledWith( req );
						expect( globalSummary.create ).toHaveBeenCalledWith( globalWins );
						expect( res.render ).toHaveBeenCalledWith( 'index.html', {
							sectorTeams: sectorTeams.results,
							overseasRegionGroups: overseasRegionGroups.results,
							ukRegions: ukRegions.results,
							globalHvcs: globalHvcs.results,
							summary: globalSummaryData,
							showDownloadLink: false
						} );
						expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
						done();
					} );
				} );
			} );
		} );
	} );
} );
