const targetProgressDataSet = require( '../data-sets/target-progress' );
const sectorPieChartsDataSet = require( '../data-sets/sector-pie-charts' );

const createPercentages = sectorPieChartsDataSet.createConfirmedUnconfirmedPercentages;

module.exports = {
	create: function( data ){

		const results = data.results;
		const wins = results.wins;

		const target = results.hvcs.target;
		const total = wins.totals.value.grand_total;
		const confirmedValue = wins.totals.value.confirmed;
		const unconfirmedValue = wins.totals.value.unconfirmed;

		return {
			id: results.campaign_id,
			name: results.name,
			averageTimeToConfirm: results.avg_time_to_confirm,
			summary: {
				dateRange: data.date_range,
				pieData: {
					confirmedUnconfirmedValue: createPercentages( total, confirmedValue, unconfirmedValue )
				},
				progress: {
					status: wins.progress.status,
					confirmed: wins.progress.confirmed_percent
				}
			},
			hvcSummary: {
				dateRange: data.date_range,
				target,
				confirmedValue,
				unconfirmedValue,
				progress: targetProgressDataSet.create( target, confirmedValue, unconfirmedValue )
			}
		};
	}
};
