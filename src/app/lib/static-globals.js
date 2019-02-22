const config = require( '../config' );

module.exports = function( env ){

	const startYear = Number( config.financialYear.start );
	const endYear = Number( config.financialYear.end );
	const years = [];

	let year = startYear;

	while( year <= endYear ){
		years.push( { year, label: `${ year }/${ ( year + 1 ).toString().substr( 2, 4 ) }` } );
		year++;
	}

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
	env.addGlobal( 'yearList', years );
	env.addGlobal( 'titleDefault', 'Department for International Trade' );
	env.addGlobal( 'serviceTitle', 'Data Hub' );
	env.addGlobal( 'projectPhase', 'beta' );
	env.addGlobal( 'feedbackLink', `${ config.datahubDomain }/support` );
	env.addGlobal( 'headerLink', `${ config.datahubDomain }/` );
	env.addGlobal( 'profileLink', `${ config.datahubDomain }/profile` );
	env.addGlobal( 'winTableColumns', winTableColumns );
	env.addGlobal( 'fdiTableColumns', fdiTableColumns );
};
