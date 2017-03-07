const pieData = require( '../data-sets/sector-pie-charts' );

module.exports = {

	create: function( winsData ){

		return {
			exportValue: winsData.wins.export.totals.value.confirmed,
			exportValueTotal: winsData.wins.export.totals.value.grand_total,
			pieData: pieData.create( winsData ),
			averageTimeToConfirm: winsData.avg_time_to_confirm
		};
	}
};
