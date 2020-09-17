const proxyquire = require('proxyquire');

const errorHandler = {};
const exportBackendService = {};
const createErrorHandler = require('../../helpers/create-error-handler');
const spy = require('../../helpers/spy');

let controller;
let globalSummary;
let globalSummaryData;

describe('Index controller', function () {

	beforeEach(function () {

		globalSummaryData = { globalSummaryData: true };
		errorHandler.createHandler = jasmine.createSpy('createHandler');
		globalSummary = { create: spy('globalSummary.create', globalSummaryData) };

		controller = proxyquire('../../../../app/controllers/controller.index', {
			'../lib/service/service.backend': { export: exportBackendService },
			'../lib/render-error': errorHandler,
			'../lib/view-models/global-summary': globalSummary
		});
	});

	describe('Handler', function () {

		let req;
		let res;
		let sectorTeams;
		let overseasRegionGroups;
		let ukRegions;
		let globalHvcs;
		let globalHvcsNoDuplicates;
		let globalWins;
		let promise;

		beforeEach(function () {

			req = {
				cookies: { sessionid: '456' },
				query: {},
				year: 2017
			};

			res = {
				render: jasmine.createSpy('res.render'),
				locals: {
					globalNavItems: [{ isActive: false, url: 'a', key: 'b', label: 'c' }]
				}
			};

			sectorTeams = { results: { sectorTeams: true } };
			overseasRegionGroups = { results: { overseasRegionGroups: true } };
			ukRegions = { results: { ukRegions: true } };
			globalHvcs = { results: [
				{ name: 'voluptatibus et aut', code: 'E35' },
				{ name: 'accusamus minus inventore', code: 'E191' },
				{ name: 'vitae tenetur quis', code: 'E25' },
				{ name: 'vitae tenetur quis', code: 'E25' },
			]
			};

			globalHvcsNoDuplicates = { results: [
				{ name: 'voluptatibus et aut', code: 'E35' },
				{ name: 'accusamus minus inventore', code: 'E191' },
				{ name: 'vitae tenetur quis', code: 'E25' },
			]
			};
			
			globalWins = { date_range: { test: 1 }, results: { globalWins: true } };

			promise = new Promise((resolve) => {

				resolve({
					sectorTeams,
					overseasRegionGroups,
					ukRegions,
					globalHvcs,
					globalWins
				});
			});

			exportBackendService.getHomepageData = spy('getHomepageData', promise);
		});

		describe('In the default year', function () {

			beforeEach(function () {

				req.isDefaultYear = true;
			});

			describe('Without any query params', function () {

				it('Should render the view with the correct data', function (done) {

					errorHandler.createHandler.and.callFake(createErrorHandler(done));

					controller(req, res);

					promise.then(() => {

						expect(exportBackendService.getHomepageData).toHaveBeenCalledWith(req);
						expect(globalSummary.create).toHaveBeenCalledWith(globalWins);
						expect(res.render).toHaveBeenCalledWith('index.html', {
							sectorTeams: sectorTeams.results,
							overseasRegionGroups: overseasRegionGroups.results,
							ukRegions: ukRegions.results,
							globalHvcs: globalHvcsNoDuplicates.results,
							summary: globalSummaryData
						});
						expect(errorHandler.createHandler).toHaveBeenCalledWith(req, res);
						done();
					});
				});
			});
		});

		describe('Not in the default year', function () {

			beforeEach(function () {

				req.isDefaultYear = false;
			});

			describe('Without any query params', function () {

				it('Should render the page', function (done) {

					errorHandler.createHandler.and.callFake(createErrorHandler(done));
					controller(req, res);

					promise.then(() => {

						expect(exportBackendService.getHomepageData).toHaveBeenCalledWith(req);
						expect(globalSummary.create).toHaveBeenCalledWith(globalWins);
						expect(res.render).toHaveBeenCalledWith('index.html', {
							sectorTeams: sectorTeams.results,
							overseasRegionGroups: overseasRegionGroups.results,
							ukRegions: ukRegions.results,
							globalHvcs: globalHvcsNoDuplicates.results,
							summary: globalSummaryData
						});
						expect(errorHandler.createHandler).toHaveBeenCalledWith(req, res);
						done();
					});
				});
			});
		});
	});
});
