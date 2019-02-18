const config = require('./config')

const appsNamesAndPaths = [
	{
		key: 'datahub-crm',
		name: 'Companies',
		path: `${config.datahubDomain}/companies`,
	}, {
		key: 'datahub-crm',
		name: 'Contacts',
		path: `${config.datahubDomain}/contacts`,
	}, {
		key: 'datahub-crm',
		name: 'Events',
		path: `${config.datahubDomain}/events`,
	}, {
		key: 'datahub-crm',
		name: 'Interactions',
		path: `${config.datahubDomain}/interactions`,
	}, {
		key: 'datahub-crm',
		name: 'Investments',
		path: `${config.datahubDomain}/investment-projects`,
	}, {
		key: 'datahub-crm',
		name: 'Orders (OMIS)',
		path: `${config.datahubDomain}/omis`,
	}, {
		key: 'datahub-mi',
		name: 'MI dashboards',
		path: `${config.findExportersDomain}`,
	}, {
		key: 'find-exporters',
		name: 'Find exporters',
		path: `${config.exportWinsUrl}`,
	},
]

module.exports = {
	appsNamesAndPaths,
}
