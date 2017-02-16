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

		const confirmedHvc = month.totals.export.hvc.value.confirmed;
		const confirmedNonExport = month.totals.non_export.value.confirmed;

		const unconfirmedHvc = month.totals.export.hvc.value.total;
		const unconfirmedNonExport = month.totals.non_export.value.total;

		let data = {
			date: month.date,
			totals: {
				hvc: {
					confirmed: confirmedHvc,
					unconfirmed: unconfirmedHvc
				},
				nonExport: {
					confirmed: confirmedNonExport,
					unconfirmed: unconfirmedNonExport
				}
			}
		};

		if( month.totals.export.non_hvc ){

			const confirmedNonHvc = month.totals.export.non_hvc.value.confirmed;
			const unconfirmedNonHvc = month.totals.export.non_hvc.value.total;

			data.totals.nonHvc = {
				confirmed: confirmedNonHvc,
				unconfirmed: unconfirmedNonHvc
			};
		}

		output.months.push( data );

		//output.max = Math.max( output.max, confirmedHvc, unconfirmedHvc, confirmedNonHvc, unconfirmedNonHvc, confirmedNonExport, unconfirmedNonExport );
	} );

	return output;
};
