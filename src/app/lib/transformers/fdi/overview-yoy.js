function addItem( arr, year, item ){

	arr.push( {
		year,
		projects: item.count,
		jobs: {
			new: item.number_new_jobs__sum,
			safe: item.number_safeguarded_jobs__sum
		},
		capex: item.investment_value__sum
	} );
}

module.exports = function( input ){

	const high = [];
	const good = [];
	const standard = [];

	for( let item of input ){

		addItem( high, item.year, item.high );
		addItem( good, item.year, item.good );
		addItem( standard, item.year, item.standard );
	}

	return {
		high,
		good,
		standard
	};
};
