const config = require( '../config' );
const financialYear = require( './financial-year' );

module.exports = function( env ){

	const startYear = Number( config.financialYearStart );
	const currentYear = financialYear.getCurrent();
	const years = [];

	let year = startYear;

	while( year <= currentYear ){
		years.push( { year, label: `${ year }/${ ( year + 1 ).toString().substr( 2, 4 ) }` } );
		year++;
	}

	const globalNavItems = [
		{ isActive: false, url: `${ config.datahubDomain }/companies`, label: 'Companies' },
		{ isActive: false, url: `${ config.datahubDomain }/contacts`, label: 'Contacts' },
		{ isActive: false, url: `${ config.datahubDomain }/events`, label: 'Events' },
		{ isActive: false, url: `${ config.datahubDomain }/interactions`, label: 'Interactions and services' },
		{ isActive: false, url: `${ config.datahubDomain }/investment-projects`, label: 'Investment projects' },
		{ isActive: false, url: `${ config.datahubDomain }/omis`, label: 'Orders (OMIS)' },
		{ isActive: true, url: '/', label: 'MI dashboards' },
	];

	const winTableColumns = {

		hvc: [
			'company', 'hvc', 'officer', 'country', 'uk-region', 'date', 'value', 'status'
		],
		nonHvc: [
			'company', 'officer', 'country', 'uk-region', 'date', 'value', 'status'
		],

		ukRegions: {
			hvc: [
				'company', 'hvc', 'officer', 'country', 'date', 'value', 'status'
			],
			nonHvc: [
				'company', 'officer', 'country', 'date', 'value', 'status'
			]
		}
	};

	const fdiTableColumns = {

		hvc: [
			'company', 'code', 'manager', 'stage', 'date', 'value', 'new-jobs', 'safe-jobs'
		],
		nonHvc: [
			'company', 'code', 'manager', 'stage', 'date', 'value', 'new-jobs', 'safe-jobs'
		]
	};

	env.addGlobal( 'asset_path', '/public/' );
	env.addGlobal( 'analyticsId', config.analyticsId );
	env.addGlobal( 'faqLink', config.faqLink );
	env.addGlobal( 'yearList', years );
	env.addGlobal( 'globalNavItems', globalNavItems );
	env.addGlobal( 'titleDefault', 'Department for International Trade' );
	env.addGlobal( 'serviceTitle', 'Data Hub' );
	env.addGlobal( 'projectPhase', 'beta' );
	env.addGlobal( 'feedbackLink', `${ config.datahubDomain }/support` );
	env.addGlobal( 'headerLink', `${ config.datahubDomain }/` );
	env.addGlobal( 'profileLink', `${ config.datahubDomain }/profile` );
	env.addGlobal( 'winTableColumns', winTableColumns );
	env.addGlobal( 'fdiTableColumns', fdiTableColumns );
};
