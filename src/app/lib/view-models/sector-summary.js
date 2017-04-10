const pieData = require( '../data-sets/sector-pie-charts' );

module.exports = {

	create: function( winsData ){

		return {
			confirmedExportValue: winsData.wins.export.totals.value.confirmed,
			unconfirmedExportValue: winsData.wins.export.totals.value.unconfirmed,
			pieData: pieData.create( winsData ),
			averageTimeToConfirm: winsData.avg_time_to_confirm
		};
	}
};
