
const groups = [
	{
		name: 'Europe',
		image: {
			url: '/public/img/overseas-region-maps/1.png',
			width: 265,
			height: 136
		},
		regions: [
			{ id: 10, colour: 'pink' },	// 'Central European Network'
			{ id: 17, colour: 'blue' },	// 'Mediterranean'
			{ id: 11, colour: 'green' },	// 'Nordic Baltic Network'
			{ id: 5, colour: 'purple' }	// 'Western Europe'
		]
	},
	{
		name: 'Near East & North Africa',
		image: {
			url: '/public/img/overseas-region-maps/2.png',
			width: 265,
			height: 136
		},
		regions: [
			{ id: 1, colour: 'pink' },		// 'North Africa'
			{ id: 14, colour: 'blue' },	// 'Middle East'
			{ id: 12, colour: 'green' }	// 'Turkey & Caucasus (includes Russia)'
		]
	},
	{
		name: 'East',
		image: {
			url: '/public/img/overseas-region-maps/3.png',
			width: 265,
			height: 136
		},
		regions: [
			{ id: 16, colour: 'pink' },	// 'China'
			{ id: 9, colour: 'blue' },		// 'South Asia'
			{ id: 13, colour: 'green' }	// 'North East Asia'
		]
	},
	{
		name: 'South Pacific',
		image: {
			url: '/public/img/overseas-region-maps/4.png',
			width: 265,
			height: 136
		},
		regions: [
			{ id: 7, colour: 'pink' },		// 'Australia & NZ'
			{ id: 2, colour: 'purple' }		// 'South East Asia'
		],
	},
	{
		name: 'East, West & South Africa',
		image: {
			url: '/public/img/overseas-region-maps/5.png',
			width: 265,
			height: 136
		},
		regions: [
			{ id: 8, colour: 'pink' },		// 'East Africa'
			{ id: 15, colour: 'blue' },	// 'South Africa'
			{ id: 4, colour: 'green' }		// 'West Africa'
		],
	},
	{
		name: 'Americas',
		image: {
			url: '/public/img/overseas-region-maps/6.png',
			width: 265,
			height: 136
		},
		regions: [
			{ id: 3, colour: 'green' },		// 'North America'
			{ id: 6, colour: 'blue' }		// 'Latin America'
		]
	}
];

function createTargetPercent( percentage ){
	return {
		capped: Math.min( percentage, 100 ),
		isOver: ( percentage > 100 ),
		value: percentage
	};
}

module.exports = function( input ){

	let output = [];
	const regions = {};

	for( let region of input ){

		regions[ region.id ] = region;
	}

	for( let group of groups ){

		output.push( {

			name: group.name,
			image: group.image,
			regions: group.regions.map( ( regionConfig ) => {
				
				let region = regions[ regionConfig.id ];
				const hvcValues = region.values.hvc;

				return {
					id: region.id,
					colour: regionConfig.colour,
					name: region.name,
					markets: region.markets,
					values: {
						hvc: {
							target: hvcValues.target,
							current: hvcValues.current,
							targetPercent: {
								confirmed: createTargetPercent( hvcValues.target_percent.confirmed ),
								unconfirmed: createTargetPercent( hvcValues.target_percent.unconfirmed )
							}
						}
					},
					confirmedPercent: {
						hvc: hvcValues.total_win_percent.confirmed,
						nonHvc: region.values.non_hvc.total_win_percent.confirmed
					},
					hvcPerformance: {
						red: ( region.hvc_performance.red || 0 ),
						amber: ( region.hvc_performance.amber || 0 ),
						green: ( region.hvc_performance.green || 0 ),
						zero: ( region.hvc_performance.zero || 0 )
					}
				};
			} )
		} );
	}

	return output;
};
