const pieData = require( '../data-sets/sector-pie-charts' );

module.exports = {

	create: function( winsData ){

		return {
			dateRange: winsData.date_range,
			confirmedExportValue: winsData.results.wins.export.totals.value.confirmed,
			unconfirmedExportValue: winsData.results.wins.export.totals.value.unconfirmed,
			pieData: pieData.create( winsData.results ),
			averageTimeToConfirm: winsData.results.avg_time_to_confirm
		};
	}
};
