const targetProgress = require( '../data-sets/target-progress' );

module.exports = {

	create: function( dateRange, summary ){

		const data = summary.non_hvc;
		const target = data.performance.target;

		return {
			dateRange,
			target,
			number: data.number,
			value: data.value,
			progress: targetProgress.create( target, data.number.confirmed, data.number.unconfirmed )
		};
	}
};
