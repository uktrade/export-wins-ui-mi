const TableSorter = require( './TableSorter' );

const KEYS = {
	company: 'company',
	hvc: 'hvc',
	officer: 'officer',
	date: 'date',
	value: 'value',
	status: 'status',
	country: 'country',
	ukRegion: 'uk-region'
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
		case KEYS.hvc:
			sorter = ( a, b ) => this.compare( Number( a.hvc.code.substring( 1 ) ), Number( b.hvc.code.substring( 1 ) ) );
			sortName = 'HVC code';
		break;
		case KEYS.officer:
			sorter = ( a, b ) => this.compare( a.lead_officer.name.toLowerCase(), b.lead_officer.name.toLowerCase() );
			sortName = 'Lead officer';
		break;
		case KEYS.date:
			sorter = ( a, b ) => this.compare( getTime( a.win_date ), getTime( b.win_date ) );
			sortName = 'Win date';
		break;
		case KEYS.value:
			sorter = ( a, b ) => this.compare( a.export_amount, b.export_amount );
			sortName = 'Export value';
		break;
		case KEYS.status:
			sorter = ( a, b ) => this.compare( a.status.modifyer, b.status.modifyer );
			sortName = 'Status';
		break;
		case KEYS.country:
			sorter = ( a, b ) => this.compare( a.country.toLowerCase(), b.country.toLowerCase() );
			sortName = 'Country';
		break;
		case KEYS.ukRegion:
			sorter = ( a, b ) => this.compare( a.uk_region.toLowerCase(), b.uk_region.toLowerCase() );
			sortName = 'UK Region';
		break;
	}

	return { sorter, sortName };
};

function sortWins( wins, sortInfo ){

	return sorter.sort( wins, sortInfo );
}

sortWins.KEYS = KEYS;

module.exports = sortWins;
