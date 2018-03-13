const TableSorter = require( '../../../lib/TableSorter' );

const KEYS = {
	market: 'market',
	projectWins: 'project-wins',
	hvcWins: 'hvc-wins'
};

const sorter = new TableSorter( KEYS, { key: KEYS.market, dir: 'asc' } );

sorter.createSorter = function( key ){

	let sorter;
	let sortName;

	switch( key ){

		case KEYS.market:
			sorter = ( a, b ) => this.compare( a.name.toLowerCase(), b.name.toLowerCase() );
			sortName = 'Market';
		break;
		case KEYS.projectWins:
			sorter = ( a, b ) => this.compare( a.wins.total, b.wins.total );
			sortName = 'Project wins';
		break;
		case KEYS.hvcWins:
			sorter = ( a, b ) => this.compare( a.wins.hvc, b.wins.hvc );
			sortName = 'HVC wins';
		break;
	}

	return { sorter, sortName };
};

function sortProjects( projects, sortInfo ){

	return sorter.sort( projects, sortInfo );
}

sortProjects.KEYS = KEYS;

module.exports = sortProjects;
