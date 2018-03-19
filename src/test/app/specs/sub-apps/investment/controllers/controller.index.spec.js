const proxyquire = require( 'proxyquire' );

const moduleFile = '../../../../../../app/sub-apps/investment/controllers/controller.index';

let controller;
let fdiService;
let getSectorsHomepageData;
let getOverseasRegionsHomepageData;
let getUkRegionsHomepageData;
let createHandler;
let renderErrorHandler;
let performanceHeadlinesViewModelSpy;
let performanceDetailsViewModelSpy;
let performanceWinProgressViewModelSpy;
let regionPerformanceViewModelSpy;
let sortSectorProgressSpy;
let sortSectorProgressSpyResponse;
let sortMarketProgressSpy;
let sortMarketProgressSpyResponse;
let sortRegionProgressSpy;
let sortRegionProgressSpyResponse;
let req;
let res;

describe( 'Index controller', function(){

	beforeEach( function(){

		sortSectorProgressSpyResponse = { sortedSectors: true, KEYS: { sector: 'sector', projectWins: 'project-wins', hvcWins: 'hvc-wins' } };
		sortMarketProgressSpyResponse = { sortedMarkets: true, KEYS: { market: 'market', projectWins: 'project-wins', hvcWins: 'hvc-wins' } };
		sortRegionProgressSpyResponse = { sortedRegions: true, KEYS: { region: 'region',	totalWins: 'total-wins', verifyWin: 'verify-win', totalJobs: 'total-jobs',	newJobs: 'new-jobs',	safeJobs: 'safe-jobs' } };

		getSectorsHomepageData = jasmine.createSpy( 'getSectorsHomepageData' );
		getOverseasRegionsHomepageData = jasmine.createSpy( 'getOverseasRegionsHomepageData' );
		getUkRegionsHomepageData = jasmine.createSpy( 'getUkRegionsHomepageData' );
		performanceHeadlinesViewModelSpy = jasmine.createSpy( 'performanceHeadlinesViewModel' );
		performanceDetailsViewModelSpy = jasmine.createSpy( 'performanceDetailsViewModel' );
		performanceWinProgressViewModelSpy = jasmine.createSpy( 'performanceWinProgressViewModel' );
		regionPerformanceViewModelSpy = jasmine.createSpy( 'regionPerformanceViewModelSpy' );
		sortSectorProgressSpy = jasmine.createSpy( 'sortSectorProgressSpy' ).and.callFake( () => sortSectorProgressSpyResponse );
		sortMarketProgressSpy = jasmine.createSpy( 'sortMarketProgressSpy' ).and.callFake( () => sortMarketProgressSpyResponse );
		sortRegionProgressSpy = jasmine.createSpy( 'sortRegionProgressSpy' ).and.callFake( () => sortRegionProgressSpyResponse );

		renderErrorHandler = jasmine.createSpy( 'renderErrorHandler' );
		createHandler = jasmine.createSpy( 'createHandler' ).and.callFake( () => renderErrorHandler );

		fdiService = { getSectorsHomepageData, getOverseasRegionsHomepageData, getUkRegionsHomepageData };

		controller = proxyquire( moduleFile, {
			'../../../lib/service/service.backend/investment/fdi': fdiService,
			'../../../lib/render-error': { createHandler },
			'../lib/sort-sector-progress': sortSectorProgressSpy,
			'../lib/sort-market-progress': sortMarketProgressSpy,
			'../lib/sort-region-progress': sortRegionProgressSpy,
			'../view-models/fdi-performance-headlines': { create: performanceHeadlinesViewModelSpy },
			'../view-models/fdi-performance-details': { create: performanceDetailsViewModelSpy },
			'../view-models/fdi-performance-win-progress': { create: performanceWinProgressViewModelSpy },
			'../view-models/fdi-performance-region-progress': { create: regionPerformanceViewModelSpy }
		} );

		req = {
			cookies: { sessionid: '456' },
			query: {},
			year: 2017,
			user: {}
		};

		res = {
			render: jasmine.createSpy( 'res.render' )
		};
	} );

	describe( 'Handler', function(){

		describe( 'With success', function(){

			beforeEach( function(){

				this.performanceHeadlinesResponse = { performanceHeadlinesResponse: true };
				this.performanceDetailsResponse = { performanceDetailsResponse: true };
				this.performanceWinProgressResponse = { performanceWinProgressResponse: true };
				this.performanceData = { date_range: { performanceDataDateRange: true }, results: { somedata: true } };
			} );

			describe( 'for sectors/default', function(){

				it( 'Should render the view', function( done ){

					let selected;
					const sortSectors = { sortParams: true };
					const sectorsData = { date_range: { sectorsDataDateRange: true }, results: { someSectorsData: true } };

					const promise =  new Promise( ( resolve ) => {
						resolve( {
							performance: this.performanceData,
							sectors: sectorsData
						} );
					} );

					getSectorsHomepageData.and.callFake( () => promise );
					performanceHeadlinesViewModelSpy.and.callFake( () => this.performanceHeadlinesResponse );
					performanceDetailsViewModelSpy.and.callFake( () => this.performanceDetailsResponse );
					performanceWinProgressViewModelSpy.and.callFake( () => this.performanceWinProgressResponse );

					req.query.sort = sortSectors;

					controller( req, res );

					promise.then( () => {

						expect( getSectorsHomepageData ).toHaveBeenCalledWith( req );
						expect( performanceHeadlinesViewModelSpy ).toHaveBeenCalledWith( this.performanceData.results );
						expect( performanceDetailsViewModelSpy ).toHaveBeenCalledWith( this.performanceData.results );
						expect( performanceWinProgressViewModelSpy ).toHaveBeenCalledWith( sectorsData.results );
						expect( sortSectorProgressSpy ).toHaveBeenCalledWith( this.performanceWinProgressResponse, sortSectors );
						expect( res.render ).toHaveBeenCalledWith( 'investment/views/index', {

							dateRange: this.performanceData.date_range,
							headlines: this.performanceHeadlinesResponse,
							details: this.performanceDetailsResponse,
							progressRows: sortSectorProgressSpyResponse,
							sortKeys: sortSectorProgressSpyResponse.KEYS,
							progressHeading: 'Sectors',
							progressColumnHeading: 'Sector',
							progressColumnHeadingKey: sortSectorProgressSpyResponse.KEYS.sector,
							tab: {
								isSectors: true,
								isOverseasRegions: false,
								isUkRegions: false,
								selected
							}
						} );

						done();
					} );
				} );
			} );

			describe( 'for overseas regions', function(){

				it( 'Should render the view', function( done ){

					const sortMarkets = { marketSort: true };
					const osRegionsData = { date_range: { osRegionsDataDateRange: true }, results: { someOsRegionsData: true } };

					const promise = new Promise( ( resolve ) => {
						resolve( {
							performance: this.performanceData,
							overseasRegions: osRegionsData
						} );
					} );

					getOverseasRegionsHomepageData.and.callFake( () => promise );
					performanceHeadlinesViewModelSpy.and.callFake( () => this.performanceHeadlinesResponse );
					performanceDetailsViewModelSpy.and.callFake( () => this.performanceDetailsResponse );
					performanceWinProgressViewModelSpy.and.callFake( () => this.performanceWinProgressResponse );

					req.query.sort = sortMarkets;
					req.query.tab = 'os-regions';

					controller( req, res );

					promise.then( () => {

						expect( getOverseasRegionsHomepageData ).toHaveBeenCalledWith( req );
						expect( performanceHeadlinesViewModelSpy ).toHaveBeenCalledWith( this.performanceData.results );
						expect( performanceDetailsViewModelSpy ).toHaveBeenCalledWith( this.performanceData.results );
						expect( performanceWinProgressViewModelSpy ).toHaveBeenCalledWith( osRegionsData.results );
						expect( sortMarketProgressSpy ).toHaveBeenCalledWith( this.performanceWinProgressResponse, sortMarkets );
						expect( res.render ).toHaveBeenCalledWith( 'investment/views/index', {

							dateRange: this.performanceData.date_range,
							headlines: this.performanceHeadlinesResponse,
							details: this.performanceDetailsResponse,
							progressRows: sortMarketProgressSpyResponse,
							sortKeys: sortMarketProgressSpyResponse.KEYS,
							progressHeading: 'Overseas markets',
							progressColumnHeading: 'Market',
							progressColumnHeadingKey: sortMarketProgressSpyResponse.KEYS.market,
							tab: {
								isSectors: false,
								isOverseasRegions: true,
								isUkRegions: false,
								selected: 'os-regions'
							}
						} );

						done();
					} );
				} );
			} );

			describe( 'for uk regions', function(){

				it( 'Should render the view', function( done ){

					const sortUkRegions = { regionSort: true };
					const ukRegionsData = { date_range: { ukRegionsDataDateRange: true }, results: { someUkRegionsData: true } };
					const regionPerformanceViewModelSpyResponse = { someRegionData: true };

					const promise = new Promise( ( resolve ) => {
						resolve( {
							performance: this.performanceData,
							ukRegions: ukRegionsData
						} );
					} );

					getUkRegionsHomepageData.and.callFake( () => promise );
					performanceHeadlinesViewModelSpy.and.callFake( () => this.performanceHeadlinesResponse );
					performanceDetailsViewModelSpy.and.callFake( () => this.performanceDetailsResponse );
					regionPerformanceViewModelSpy.and.callFake( () => regionPerformanceViewModelSpyResponse );

					req.query.sort = sortUkRegions;
					req.query.tab = 'uk-regions';

					controller( req, res );

					promise.then( () => {

						expect( getUkRegionsHomepageData ).toHaveBeenCalledWith( req );
						expect( performanceHeadlinesViewModelSpy ).toHaveBeenCalledWith( this.performanceData.results );
						expect( performanceDetailsViewModelSpy ).toHaveBeenCalledWith( this.performanceData.results );
						expect( sortRegionProgressSpy ).toHaveBeenCalledWith( ukRegionsData.results, sortUkRegions );
						expect( regionPerformanceViewModelSpy ).toHaveBeenCalledWith( sortRegionProgressSpyResponse );
						expect( res.render ).toHaveBeenCalledWith( 'investment/views/index', {

							dateRange: this.performanceData.date_range,
							headlines: this.performanceHeadlinesResponse,
							details: this.performanceDetailsResponse,
							progressRows: regionPerformanceViewModelSpyResponse,
							sortKeys: sortRegionProgressSpyResponse.KEYS,
							progressHeading: 'UK regions',
							tab: {
								isSectors: false,
								isOverseasRegions: false,
								isUkRegions: true,
								selected: 'uk-regions'
							}
						} );

						done();
					} );
				} );
			} );
		} );

		describe( 'With a failure', function(){

			it( 'Should call render error', function( done ){

				const err = new Error( 'some error' );

				const promise = new Promise( ( resolve, reject ) => {
					reject( err );
				} );

				getSectorsHomepageData.and.callFake( () => promise );

				controller( req, res );

				setTimeout( () => {

					expect( createHandler ).toHaveBeenCalledWith( req, res );
					expect( getSectorsHomepageData ).toHaveBeenCalledWith( req );
					expect( res.render ).not.toHaveBeenCalled();
					expect( renderErrorHandler ).toHaveBeenCalledWith( err );
					done();
				}, 1 );
			} );
		} );
	} );
} );
