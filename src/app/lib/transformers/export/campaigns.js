module.exports = function( input ){

	let data = [];

	input.campaigns.forEach( ( campaign ) => {

		const totals = campaign.totals;

		data.push({
			id: campaign.campaign_id,
			name: campaign.campaign,
			target: totals.target,
			change: totals.change,
			status: totals.progress.status,
			progress: {
				confirmed: totals.progress.confirmed_percent,
				unconfirmed: totals.progress.unconfirmed_percent
			},
			value: {
				confirmed: totals.hvc.value.confirmed,
				unconfirmed: totals.hvc.value.unconfirmed,
				total: totals.hvc.value.total
			},
			number: {
				total: totals.hvc.number.total
			}
		});
	} );

	return data;
};
