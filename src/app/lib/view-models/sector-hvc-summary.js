const targetProgressDataSet = require( '../data-sets/target-progress' );

module.exports = {

	create: function( winsData ){

		return {
			dateRange: winsData.date_range,
			target: winsData.results.hvcs.target,
			confirmedValue: winsData.results.wins.export.hvc.value.confirmed,
			unconfirmedValue: winsData.results.wins.export.hvc.value.unconfirmed,
			progress: targetProgressDataSet.create( winsData.results )
		};
	}
};
