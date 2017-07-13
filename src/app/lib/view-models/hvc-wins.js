module.exports = {

	create: function( data ){

		return {
			dateRange: data.date_range,
			hvc: data.results.hvc,
			wins: data.results.wins
		};
	}
};
