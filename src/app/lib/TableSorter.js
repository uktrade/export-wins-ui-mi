function TableSorter( sortKeys, defaultSort ){

	if( !sortKeys ){ throw new Error( 'sortKeys required for TableSorter' ); }
	if( !defaultSort ){ throw new Error( 'defaultSort required for TableSorter' ); }

	this.sortKeys = sortKeys;
	this.defaultSort = defaultSort;
}

TableSorter.prototype.isValidSortKey = function( key ){

	for( let prop in this.sortKeys ){
		if( this.sortKeys[ prop ] === key ){
			return true;
		}
	}

	return false;
};

TableSorter.prototype.sort = function( items, sort = this.defaultSort ){

	if( !this.createSorter ){ throw new Error( 'Must define a createSorter function before sorting' ); }

	if( !Array.isArray( items ) ){ return items; }

	const isValidDir = ( sort.dir === 'asc' || sort.dir === 'desc' );

	if( isValidDir && this.isValidSortKey( sort.key ) ){

		const ascending = sort.dir === 'asc';

		this.greater = ( ascending ? 1 : -1 );
		this.lower = ( ascending ? -1 : 1 );

		const { sorter, sortName } = this.createSorter( sort.key );

		const sortedItems = items.sort( sorter );

		sortedItems.sortKey = sort.key;
		sortedItems.sortDir = sort.dir;
		sortedItems.sortName = sortName;
		sortedItems.sortDirName = ( ascending ? 'ascending' : 'descending' );

		return sortedItems;

	} else {

		return items;
	}
};

TableSorter.prototype.compare = function compare( a, b ){

	if( a > b ){
		return this.greater;
	} else if( a < b ){
		return this.lower;
	} else {
		return 0;
	}
};

module.exports = TableSorter;
