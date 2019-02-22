const config = require('./config.js');

const globalNavItems = [
	{ isActive: false, url: `${config.datahubDomain}/companies`, key: 'companies', label: 'Companies' },
	{ isActive: false, url: `${config.datahubDomain}/contacts`, key: 'contacts', label: 'Contacts' },
	{ isActive: false, url: `${config.datahubDomain}/events`, key: 'events', label: 'Events' },
	{ isActive: false, url: `${config.datahubDomain}/interactions`, key: 'interactions', label: 'Interactions' },
	{ isActive: false, url: `${config.datahubDomain}/investment-projects`, key: 'investments', label: 'Investments' },
	{ isActive: false, url: `${config.datahubDomain}/omis`, key: 'orders-omis', label: 'Orders (OMIS)' },
	{ isActive: true, url: `/`, key: 'datahub-mi', label: 'MI dashboards' },
];

module.exports = globalNavItems;
