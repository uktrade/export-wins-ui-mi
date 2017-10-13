const targetProgress = require( '../data-sets/target-progress' );

const TYPES = {
	new_exporters: 'New',
	sustainable: 'Sustainable',
	growth: 'Growth',
	unknown: 'Unknown'
};

module.exports = {

	create: function( data ){

		const results = data.results;
		const items = [];

		for( let type in TYPES ){

			const target = ( results.target && results.target[ type ] || 0 );
			const wins = results.export_experience[ type ];

			if( wins ){

				items.push( {
					name: TYPES[ type ],
					target,
					value: wins.value.total,
					wins: {
						total: wins.number.total,
						confirmed: wins.number.confirmed
					},
					progress: targetProgress.create( target, wins.number.confirmed, wins.number.unconfirmed )
				} );
			}
		}

		return {
			dateRange: data.date_range,
			items
		};
	}
};
