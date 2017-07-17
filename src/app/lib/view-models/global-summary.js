const targetProgressDataSet = require( '../data-sets/target-progress' );

module.exports = {

	create: function( data ){

		const hvcWinValue = data.results.wins.hvc.value;

		return {
			dateRange: data.date_range,
			wins: data.results.wins,
			progress: targetProgressDataSet.create( data.results.total_target, hvcWinValue.confirmed, hvcWinValue.unconfirmed ),
			target: data.results.total_target
		};
	}
};
