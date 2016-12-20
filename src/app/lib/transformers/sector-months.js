const largeNumber = require( '../nunjucks-filters/large-number' );

module.exports = function( input ){

	const output = {
		//max: input.hvcs.target,
		//min: 0,
		target: input.hvcs.target,
		targetName: ( '£' + largeNumber( input.hvcs.target ) ),
		months: []
	};

	input.months.forEach( ( month ) => {

		const confirmedHvc = month.totals.hvc.value.confirmed;
		const confirmedNonHvc = month.totals.non_hvc.value.confirmed;
		const confirmedNonExport = month.totals.non_export.value.confirmed;

		const unconfirmedHvc = month.totals.hvc.value.total;
		const unconfirmedNonHvc = month.totals.non_hvc.value.total;
		const unconfirmedNonExport = month.totals.non_export.value.total;

		output.months.push( {
			date: month.date,
			totals: {
				hvc: {
					confirmed: confirmedHvc,
					unconfirmed: unconfirmedHvc
				},
				nonHvc: {
					confirmed: confirmedNonHvc,
					unconfirmed: unconfirmedNonHvc
				},
				nonExport: {
					confirmed: confirmedNonExport,
					unconfirmed: unconfirmedNonExport
				}
			}
		} );

		//output.max = Math.max( output.max, confirmedHvc, unconfirmedHvc, confirmedNonHvc, unconfirmedNonHvc, confirmedNonExport, unconfirmedNonExport );
	} );

	return output;
};
