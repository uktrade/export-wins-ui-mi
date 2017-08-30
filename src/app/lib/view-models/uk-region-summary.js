const targetProgressDataSet = require( '../data-sets/target-progress' );
const pieData = require( '../data-sets/sector-pie-charts' );

module.exports = {

	create: function( winsData ){

		const results = winsData.results;
		const exportTotals = results.wins.export.totals;
		const target = 0;//TODO: get this from API
		const number = exportTotals.number;
		const value = exportTotals.value;

		return {
			dateRange: winsData.date_range,
			target,
			number,
			value,
			totalValue: exportTotals.value.grand_total,
			averageTimeToConfirm: results.avg_time_to_confirm,
			pieData: pieData.createForNumber( winsData.results ),
			progress: targetProgressDataSet.create( target, number.confirmed, number.unconfirmed )
		};
	}
};
