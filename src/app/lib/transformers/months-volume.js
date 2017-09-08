module.exports = function( input ){

	const experienceTargets = input.export_experience.target;
	const target =  ( experienceTargets ? experienceTargets.total : 0 );

	const output = {
		target,
		targetName: target,
		months: []
	};

	input.months.forEach( ( month ) => {

		const confirmedHvc = month.totals.export.hvc.number.confirmed;
		const confirmedNonExport = month.totals.non_export.number.confirmed;

		const unconfirmedHvc = month.totals.export.hvc.number.unconfirmed;
		const unconfirmedNonExport = month.totals.non_export.number.unconfirmed;

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

			const confirmedNonHvc = month.totals.export.non_hvc.number.confirmed;
			const unconfirmedNonHvc = month.totals.export.non_hvc.number.unconfirmed;

			data.totals.nonHvc = {
				confirmed: confirmedNonHvc,
				unconfirmed: unconfirmedNonHvc
			};
		}

		output.months.push( data );
	} );

	return output;
};
