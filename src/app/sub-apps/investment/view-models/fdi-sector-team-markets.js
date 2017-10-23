function createItem( data, type, modifyer, hasTotal ){

	const item = {
		type,
		modifyer,
		total: {
			number: data.total,
			percent: null
		},
		high: data.high,
		good: data.good,
		standard: data.standard
	};

	if( hasTotal ){

		item.total.percent = ( data.progress + '%' );
	}

	return item;
}

module.exports = {

	create: function( markets ){

		const out = [];

		for( let market of markets ){

			out.push( {
				name: market.name,
				results: [
					createItem( market.target, 'Target', 'target', true ),
					createItem( market.verified, 'Verified', 'verified', true ),
					createItem( market.confirmed, 'Result confirmed', 'confirmed', true ),
					createItem( market.pipeline, 'Pipeline', 'pipeline', false )
				]
			} );
		}

		return out;
	}
};
