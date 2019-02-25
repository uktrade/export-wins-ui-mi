const { transformAppsToPermittedApps } = require('../../../../../app/lib/transformers/permitted-apps.js');

describe('Transform apps to permitted apps', function () {

	const mockData = {
		appsNamesAndPaths: [ {
			key: 'datahub-crm',
			name: 'Companies',
			path: 'https://www.abc.io/companies'
		}, {
			key: 'datahub-crm',
			name: 'Contacts',
			path: 'https://www.abc.io/contacts'
		}, {
			key: 'datahub-crm',
			name: 'Events',
			path: 'https://www.abc.io/events'
		}, {
			key: 'datahub-crm',
			name: 'Interactions',
			path: 'https://www.abc.io/interactions'
		}, {
			key: 'datahub-crm',
			name: 'Investments',
			path: 'https://www.abc.io/investment-projects'
		}, {
			key: 'datahub-crm',
			name: 'Orders (OMIS)',
			path: 'https://www.abc.io/omis'
		}, {
			key: 'datahub-mi',
			name: 'MI dashboards',
			path: '/'
		}, {
			key: 'find-exporters',
			name: 'Find exporters',
			path: 'https://def.io/'
		} ]
	};

	describe( 'When permittedApps is an array', () => {
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

			expect(transformAppsToPermittedApps(mockData.appsNamesAndPaths, permittedApps).length).toEqual(1);
			expect(transformAppsToPermittedApps(mockData.appsNamesAndPaths, permittedApps)).toEqual([{
				key: 'find-exporters',
				name: 'Find exporters',
				path: 'https://def.io/'
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
					key: 'datahub-mi',
					url: 'http://yhk.cay',
					name: 'veritatis voluptas adipisci'
				}];

			expect(transformAppsToPermittedApps(mockData.appsNamesAndPaths, permittedApps).length).toEqual(2);
		});

		it('should return no allowed apps', () => {

			const permittedApps = [
				{
					key: 'no-app',
					url: 'http://amwkcnyk.mem',
					name: 'incidunt rerum et'
				}];

			expect(transformAppsToPermittedApps(mockData.appsNamesAndPaths, permittedApps).length).toEqual(0);
		});
	} );

	describe( 'When permittedApps is an empty object', () => {
		it( 'should return no allowed apps', () => {

			expect(transformAppsToPermittedApps(mockData.appsNamesAndPaths, {}).length).toEqual(0);
		} );
	} );
});

