const targetProgressDataSet = require( '../data-sets/target-progress' );

module.exports = {

	create: function( winsData ){

		const results = winsData.results;
		const exportWins = results.wins.export;
		const exportTotals = exportWins.totals;
		const target = ( results.target ? results.target.total : 0 );
		const number = exportTotals.number;
		const value = exportTotals.value;

		number.hvc = exportWins.hvc.number.confirmed;
		number.nonHvc = exportWins.non_hvc.number.confirmed;

		return {
			dateRange: winsData.date_range,
			target,
			number,
			value,
			totalValue: exportTotals.value.grand_total,
			averageTimeToConfirm: results.avg_time_to_confirm,
			progress: targetProgressDataSet.create( target, number.confirmed, number.unconfirmed )
		};
	}
};
