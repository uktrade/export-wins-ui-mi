module.exports = function( input ){

	let data = [];

	input.campaigns.forEach( ( campaign ) => {

		const totals = campaign.totals;

		data.push({
			campaign: campaign.campaign,
			target: totals.target,
			change: totals.change,
			status: totals.progress.status,
			progress: {
				confirmed: totals.progress.confirmed_percent,
				unconfirmed: totals.progress.unconfirmed_percent
			},
			value: {
				confirmed: totals.hvc.value.confirmed,
				total: totals.hvc.value.total
			}
		});
	} );

	return data;
};
