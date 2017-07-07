const targetProgressDataSet = require( '../data-sets/target-progress' );

module.exports = {

	create: function( winsData ){

		const target = winsData.results.hvcs.target;
		const confirmedValue = winsData.results.wins.export.hvc.value.confirmed;
		const unconfirmedValue = winsData.results.wins.export.hvc.value.unconfirmed;

		return {
			dateRange: winsData.date_range,
			target,
			confirmedValue,
			unconfirmedValue,
			progress: targetProgressDataSet.create( target, confirmedValue, unconfirmedValue )
		};
	}
};
