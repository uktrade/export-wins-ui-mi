const KEYS = {
	company: 'company',
	hvc: 'hvc',
	officer: 'officer',
	date: 'date',
	value: 'value',
	status: 'status'
};

function sortWins( wins, sort = { key: 'company', dir: 'asc' } ){

	if( !wins ){ return wins; }

	const isValidDir = ( sort.dir === 'asc' || sort.dir === 'desc' );
	const ascending = sort.dir === 'asc';
	const greater = ( ascending ? 1 : -1 );
	const lower = ( ascending ? -1 : 1 );

	let sorter;
	let isValidKey;
	let sortName;

	function compare( a, b ){

		if( a > b ){
			return greater;
		} else if( a < b ){
			return lower;
		} else {
			return 0;
		}
	}

	function getTime( dateStr ){
		return ( new Date( dateStr ) ).getTime();
	}

	for( let value in KEYS ){
		if( value === sort.key ){
			isValidKey = true;
			break;
		}
	}

	if( isValidKey && isValidDir ){

		switch( sort.key ){

			case KEYS.company:
				sorter = ( a, b ) => compare( a.company.name.toLowerCase(), b.company.name.toLowerCase() );
				sortName = 'Company name';
			break;
			case KEYS.hvc:
				sorter = ( a, b ) => compare( Number( a.hvc.code.substring( 1 ) ), Number( b.hvc.code.substring( 1 ) ) );
				sortName = 'HVC code';
			break;
			case KEYS.officer:
				sorter = ( a, b ) => compare( a.lead_officer.name.toLowerCase(), b.lead_officer.name.toLowerCase() );
				sortName = 'Lead officer';
			break;
			case KEYS.date:
				sorter = ( a, b ) => compare( getTime( a.win_date ), getTime( b.win_date ) );
				sortName = 'Win date';
			break;
			case KEYS.value:
				sorter = ( a, b ) => compare( a.export_amount, b.export_amount );
				sortName = 'Export value';
			break;
			case KEYS.status:
				sorter = ( a, b ) => compare( a.status.modifyer, b.status.modifyer );
				sortName = 'Status';
			break;
		}

		const sortedWins = wins.sort( sorter );

		sortedWins.sortKey = sort.key;
		sortedWins.sortDir = sort.dir;
		sortedWins.sortName = sortName;
		sortedWins.sortDirName = ( ascending ? 'ascending' : 'descending' );

		return sortedWins;

	} else {

		return wins;
	}
}

sortWins.KEYS = KEYS;

module.exports = sortWins;
