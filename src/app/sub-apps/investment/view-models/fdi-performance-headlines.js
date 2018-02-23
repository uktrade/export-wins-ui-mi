module.exports = {

	create: function( input ){

		if( input ){

			return {
				wins: {
					total: input.wins.count,
					percentage: {
						high: Math.round( input.wins.performance.high.percent ),
						good: Math.round( input.wins.performance.good.percent ),
						standard: Math.round( input.wins.performance.standard.percent )
					}
				},
				breakdown: {
					type: {
						hvc: input.wins.campaign.hvc,
						nonHvc: input.wins.campaign.non_hvc
					},
					stage: {
						verify: input.wins.stages.verify_win,
						won: input.wins.stages.won
					}
				},
				jobs: input.wins.jobs,
				pipeline: {
					total: input.pipeline.active.count,
					percentage: {
						high: Math.round( input.pipeline.active.performance.high.percent ),
						good: Math.round( input.pipeline.active.performance.good.percent ),
						standard: Math.round( input.pipeline.active.performance.standard.percent )
					}
				}
			};
		}

		return null;
	}
};
