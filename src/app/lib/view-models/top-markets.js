function createScale( data ){

	let highest = 0;

	data.forEach( ( item ) => {

		highest = Math.max( highest, item.totalValue );
	} );

	return {
		high: highest,
		mid: ( highest / 2 ),
		low: ( highest / 4 )
	};
}

module.exports = {

	create: function( data ){

		return {
			dateRange: data.date_range,
			items: data.results,
			count: data.count,
			scale: createScale( data.results )
		};
	}
};
