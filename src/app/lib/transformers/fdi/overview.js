module.exports = function( input ){

	const total = input.total;
	const verified = input.performance.verified;

	const output = {
		target: input.target,
		totals: {
			verified: total.verified.count,
			pending: total.pending.count,
			metPercent: input.verified_met_percent
		},
		jobs: {
			new: {
				verified: total.verified.number_new_jobs__sum,
				pending: total.pending.number_new_jobs__sum
			},
			safe: {
				verified: total.verified.number_safeguarded_jobs__sum,
				pending: total.pending.number_safeguarded_jobs__sum
			}
		},
		value: {
			verified: total.verified.investment_value__sum,
			pending: total.pending.investment_value__sum
		}
	};

	if( verified ){

		output.verified = {
			high: {
				number: verified.high.count,
				percent: verified.high.value__percent
			},
			good: {
				number: verified.good.count,
				percent: verified.good.value__percent
			},
			standard:{
				number: verified.standard.count,
				percent: verified.standard.value__percent
			}
		};

	} else {

		output.verified = {
			high: { number: 0, percent: 0 },
			good: { number: 0, percent: 0 },
			standard: { number: 0, percent: 0 }
		};
	}

	return output;
};
