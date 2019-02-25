const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const modulePath = '../../../../app/middleware/build-global-nav.js';

describe('Build global navigation', function () {

	let req;
	let res;
	let next;
	let buildGlobalNav;
	let config;

	beforeEach(function () {
		res = {
			locals: {}
		};
		config = {
			appsNamesAndPaths: [{
				key: 'datahub-mi',
				name: 'MI dashboards',
				path: '/',
			}, {
				key: 'find-exporters',
				name: 'Find exporters',
				path: 'http://www.def.gov.uk',
			}]
		};
		({ buildGlobalNav } = proxyquire(modulePath, {
			'../config': config,
		}));

		next = jasmine.createSpy('next');
	});

	it('should hide links to apps in which the user does not have permission to access', () => {
		req = {
			user: {
				permitted_applications: [{
					'key': 'datahub-mi',
					'url': 'http://amwkcnyk.mem',
					'name': 'incidunt rerum et'
				}]
			}
		};
		buildGlobalNav(req, res, next);
		expect(next).toHaveBeenCalled();
		expect(res.locals.globalNavItems).toEqual([{
			isActive: true,
			url: '/',
			key: 'datahub-mi',
			label: 'MI dashboards'
		}
		]);
	});

	it('should show links to apps in which the user does have permission to access', () => {

		req = {
			user: {
				permitted_applications: [
					{
						'key': 'find-exporters',
						'url': '',
						'name': ''
					}, {
						'key': 'datahub-mi',
						'url': '',
						'name': ''
					}
				]
			}
		};
		buildGlobalNav(req, res, next);
		expect(next).toHaveBeenCalled();

		expect(res.locals.globalNavItems).toEqual([{
			isActive: true,
			url: '/',
			key: 'datahub-mi',
			label: 'MI dashboards'
		}, {
			isActive: false,
			url: 'http://www.def.gov.uk',
			key: 'find-exporters',
			label: 'Find exporters'
		}
		]);
	});
});
