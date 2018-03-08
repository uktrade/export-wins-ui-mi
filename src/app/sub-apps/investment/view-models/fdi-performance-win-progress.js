
function createItemWithParts( parts ){

	return ( count, fromItem ) => ({
		count,
		start: ( fromItem ? ( fromItem.start + fromItem.percent ) : 0 ),
		percent: Number(( parts * count ).toFixed( 2 ) )
	});
}

function createSegments( item, createItem ){

	const won = createItem( item.wins.won );
	const verifyWin = createItem( item.wins.verify_win, won );
	const pipeline = createItem( item.pipeline, verifyWin );

	return {
		won,
		verifyWin,
		pipeline,
		target: createItem( item.target )
	};
}

module.exports = {

	create: function( input ){

		let output = input;

		if( Array.isArray( input ) ){

			output = [];

			const max = input.reduce( ( highest, item ) => {

				const combinedTotal = ( item.pipeline + item.wins.total );

				return Math.max( highest, item.target, combinedTotal );
			}, 0 );

			const parts = ( 100 / max );
			const createItem = createItemWithParts( parts );

			for( let item of input ){

				output.push( {

					id: item.id,
					name: item.name,
					wins: {
						total: item.wins.total,
						hvc: item.wins.hvc_wins
					},
					segments: createSegments( item, createItem )
				} );
			}
		}

		return output;
	}
};
