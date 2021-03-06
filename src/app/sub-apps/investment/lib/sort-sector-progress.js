const TableSorter = require( '../../../lib/TableSorter' );

const KEYS = {
	sector: 'sector',
	nonHvcWins: 'non-hvc-wins',
	hvcWins: 'hvc-wins'
};

const sorter = new TableSorter( KEYS, { key: KEYS.sector, dir: 'asc' } );

sorter.createSorter = function( key ){

	let sorter;
	let sortName;

	switch( key ){

		case KEYS.sector:
			sorter = ( a, b ) => this.compare( a.name.toLowerCase(), b.name.toLowerCase() );
			sortName = 'Sector';
		break;
		case KEYS.nonHvcWins:
			sorter = ( a, b ) => this.compare( a.wins.nonHvc, b.wins.nonHvc );
			sortName = 'Non HVC wins';
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
