const TableSorter = require( '../../../lib/TableSorter' );

const KEYS = {
	company: 'company',
	code: 'code',
	manager: 'manager',
	stage: 'stage',
	date: 'date',
	value: 'value',
	newJobs: 'new-jobs',
	safeJobs: 'safe-jobs'
};

function getTime( dateStr ){
	return ( new Date( dateStr ) ).getTime();
}

const sorter = new TableSorter( KEYS, { key: KEYS.company, dir: 'asc' } );

sorter.createSorter = function( key ){

	let sorter;
	let sortName;

	switch( key ){

		case KEYS.company:
			sorter = ( a, b ) => this.compare( a.company.name.toLowerCase(), b.company.name.toLowerCase() );
			sortName = 'Company name';
		break;
		case KEYS.code:
			sorter = ( a, b ) => this.compare( a.code.toLowerCase(), b.code.toLowerCase() );
			sortName = 'Project code';
		break;
		case KEYS.manager:
			sorter = ( a, b ) => this.compare( a.relationshipManager.toLowerCase(), b.relationshipManager.toLowerCase() );
			sortName = 'Manager';
		break;
		case KEYS.stage:
			sorter = ( a, b ) => this.compare( a.stage, b.stage );
			sortName = 'Stage';
		break;
		case KEYS.date:
			sorter = ( a, b ) => this.compare( getTime( a.date ), getTime( b.date ) );
			sortName = 'Date';
		break;
		case KEYS.value:
			sorter = ( a, b ) => this.compare( a.investmentValue, b.investmentValue );
			sortName = 'Value';
		break;
		case KEYS.newJobs:
			sorter = ( a, b ) => this.compare( a.jobs.new, b.jobs.new );
			sortName = 'New jobs';
		break;
		case KEYS.safeJobs:
			sorter = ( a, b ) => this.compare( a.jobs.safe, b.jobs.safe );
			sortName = 'Safeguarded jobs';
		break;
	}

	return { sorter, sortName };
};

function sortProjects( projects, sortInfo ){

	return sorter.sort( projects, sortInfo );
}

sortProjects.KEYS = KEYS;

module.exports = sortProjects;
