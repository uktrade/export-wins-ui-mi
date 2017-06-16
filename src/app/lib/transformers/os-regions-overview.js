function createTargetPercent( percentage ){
	return {
		capped: Math.min( percentage, 100 ),
		isOver: ( percentage > 100 ),
		value: percentage
	};
}

module.exports = function( regions ){

	let output = [];

	for( let region of regions ){

		const hvcValues = region.values.hvc;

		output.push( {
			id: region.id,
			name: region.name,
			markets: region.markets,
			values: {
				hvc: {
					target: hvcValues.target,
					current: hvcValues.current,
					targetPercent: {
						confirmed: createTargetPercent( hvcValues.target_percent.confirmed ),
						unconfirmed: createTargetPercent( hvcValues.target_percent.unconfirmed )
					}
				}
			},
			confirmedPercent: {
				hvc: hvcValues.total_win_percent.confirmed,
				nonHvc: region.values.non_hvc.total_win_percent.confirmed
			},
			hvcPerformance: {
				red: ( region.hvc_performance.red || 0 ),
				amber: ( region.hvc_performance.amber || 0 ),
				green: ( region.hvc_performance.green || 0 ),
				zero: ( region.hvc_performance.zero || 0 )
			}
		} );
	}

	return output;
};
