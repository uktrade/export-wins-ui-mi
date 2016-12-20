
module.exports = {

	create: function( data ){

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
};
