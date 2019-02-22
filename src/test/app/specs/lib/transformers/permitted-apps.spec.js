const { transformAppsToPermittedApps } = require('../../../../../app/lib/transformers/permitted-apps.js');

describe('Transform apps to permitted apps', function () {

	it('should return one allowed app', () => {

		const permittedApps = [
			{
				key: 'find-exporters',
				url: 'http://amwkcnyk.mem',
				name: 'incidunt rerum et'
			},
			{
				key: 'another-app',
				url: 'http://yhk.cay',
				name: 'veritatis voluptas adipisci'
			}];

		const appsNamesAndPaths = [
			{
				key: 'find-exporters',
				name: 'Find exporters',
				path: 'https://find-exporters.datahub.trade.gov.uk/'
			}
		];

		expect(transformAppsToPermittedApps(appsNamesAndPaths, permittedApps).length).toEqual(1);
		expect(transformAppsToPermittedApps(appsNamesAndPaths, permittedApps)).toEqual([{
			key: 'find-exporters',
			name: 'Find exporters',
			path: 'https://find-exporters.datahub.trade.gov.uk/'
		}]);
	});

	it('should return two allowed apps', () => {

		const permittedApps = [
			{
				key: 'find-exporters',
				url: 'http://amwkcnyk.mem',
				name: 'incidunt rerum et'
			},
			{
				key: 'another-app',
				url: 'http://yhk.cay',
				name: 'veritatis voluptas adipisci'
			}];

		const appsNamesAndPaths = [
			{
				key: 'find-exporters',
				name: 'Find exporters',
				path: 'https://find-exporters.datahub.trade.gov.uk/'
			},
			{
				key: 'another-app',
				url: 'http://yhk.cay',
				name: 'veritatis voluptas adipisci'
			},
		];

		expect(transformAppsToPermittedApps(appsNamesAndPaths, permittedApps).length).toEqual(2);
	});

	it('should return no allowed apps', () => {

		const permittedApps = [
			{
				key: 'no-app',
				url: 'http://amwkcnyk.mem',
				name: 'incidunt rerum et'
			}];

		const appsNamesAndPaths = [
			{
				key: 'find-exporters',
				name: 'Find exporters',
				path: 'https://find-exporters.datahub.trade.gov.uk/'
			},
		];

		expect(transformAppsToPermittedApps(appsNamesAndPaths, permittedApps).length).toEqual(0);
	});

});

