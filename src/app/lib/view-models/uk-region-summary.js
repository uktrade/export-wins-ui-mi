const targetProgressDataSet = require( '../data-sets/target-progress' );

module.exports = {

	create: function( winsData ){

		const results = winsData.results;
		const exportWins = results.wins.export;
		const exportTotals = exportWins.totals;
		const target = ( results.target ? results.target.total : 0 );
		const value = exportTotals.value;
		const number = {
			totals: exportTotals.number,
			hvc: exportWins.hvc.number,
			nonHvc: exportWins.non_hvc.number
		};

		return {
			dateRange: winsData.date_range,
			target,
			number,
			value,
			totalValue: exportTotals.value.grand_total,
			averageTimeToConfirm: results.avg_time_to_confirm,
			progress: targetProgressDataSet.create( target, number.totals.confirmed, number.totals.unconfirmed )
		};
	}
};
