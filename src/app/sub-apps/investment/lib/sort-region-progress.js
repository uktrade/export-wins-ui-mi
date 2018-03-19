const TableSorter = require( '../../../lib/TableSorter' );

const KEYS = {
	region: 'region',
	totalWins: 'total-wins',
	verifyWin: 'verify-win',
	totalJobs: 'total-jobs',
	newJobs: 'new-jobs',
	safeJobs: 'safe-jobs'
};

const sorter = new TableSorter( KEYS, { key: KEYS.region, dir: 'asc' } );

sorter.createSorter = function( key ){

	let sorter;
	let sortName;

	switch( key ){

		case KEYS.region:
			sorter = ( a, b ) => this.compare( a.name.toLowerCase(), b.name.toLowerCase() );
			sortName = 'Region';
		break;
		case KEYS.totalWins:
			sorter = ( a, b ) => this.compare( a.wins.total, b.wins.total );
			sortName = 'Project wins';
		break;
		case KEYS.verifyWin:
			sorter = ( a, b ) => this.compare( a.wins.verify_win.count, b.wins.verify_win.count );
			sortName = 'Verify win';
		break;
		case KEYS.totalJobs:
			sorter = ( a, b ) => this.compare( a.jobs.total, b.jobs.total );
			sortName = 'Total jobs';
		break;
		case KEYS.newJobs:
			sorter = ( a, b ) => this.compare( a.jobs.new, b.jobs.new );
			sortName = 'New jobs';
		break;
		case KEYS.safeJobs:
			sorter = ( a, b ) => this.compare( a.jobs.safeguarded, b.jobs.safeguarded );
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
