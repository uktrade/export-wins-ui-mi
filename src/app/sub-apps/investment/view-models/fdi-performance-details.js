const preciseNumber = require( '../../../lib/nunjucks-filters/precise-number' );

const names = {
	high: 'High',
	good: 'Good',
	standard: 'Standard'
};

module.exports = {

	create: function( input ){

		const headings = [
			'Value',
			'% of total',
			'HVC',
			'Non-HVC',
			'New jobs',
			'Safeguarded jobs'
		];

		const wins = {
			headings,
			rows: [],
			totals: []
		};
		const activePipeline = {
			headings,
			rows: [],
			totals: []
		};
		const pipeline = {
			active: {},
			prospect: {},
			assign: {}
		};

		if( input ){

			if( input.wins ){

				wins.totals = [
					'Totals',
					'',
					preciseNumber( input.wins.campaign.hvc.count ),
					preciseNumber( input.wins.campaign.non_hvc.count ),
					preciseNumber( input.wins.jobs.new ),
					preciseNumber( input.wins.jobs.safeguarded )
				];

				if( input.wins.performance ){

					for( let type in names ){

						const data = input.wins.performance[ type ];

						wins.rows.push( [
							names[ type ],
							( data.percent + '%' ),
							preciseNumber( data.campaign.hvc.count ),
							preciseNumber( data.campaign.non_hvc.count ),
							preciseNumber( data.jobs.new ),
							preciseNumber( data.jobs.safeguarded )
						] );
					}
				}
			}


			if( input.pipeline ){

				if( input.pipeline.active ){

					activePipeline.totals = [
						'Totals',
						'',
						preciseNumber( input.pipeline.active.campaign.hvc.count ),
						preciseNumber( input.pipeline.active.campaign.non_hvc.count ),
						preciseNumber( input.pipeline.active.jobs.new ),
						preciseNumber( input.pipeline.active.jobs.safeguarded )
					];

					if( input.pipeline.active.performance ){

						for( let type in names ){

							const data = input.pipeline.active.performance[ type ];

							activePipeline.rows.push( [
								names[ type ],
								( data.percent + '%' ),
								preciseNumber( data.campaign.hvc.count ),
								preciseNumber( data.campaign.non_hvc.count ),
								preciseNumber( data.jobs.new ),
								preciseNumber( data.jobs.safeguarded )
							] );
						}
					}
				}
			}

			if( input.stages ){

				const stages = [
					[ 'active' ],
					[ 'prospect' ],
					[ 'assign_pm', 'assign' ]
				];

				for( let [ inputName, outputName ] of stages ){

					outputName = ( outputName || inputName );

					if( input.stages[ inputName ] ){

						pipeline[ outputName ] = {
							count: preciseNumber( input.stages[ inputName ].count ),
							percent: Math.round( input.stages[ inputName ].percent )
						};
					}
				}
			}
		}

		return { wins, activePipeline, pipeline };
	}
};
