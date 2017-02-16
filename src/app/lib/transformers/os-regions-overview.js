
const groups = [
	{
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

module.exports = function( input ){

	let output = [];
	const regions = {};

	for( let region of input ){

		regions[ region.id ] = region;
	}

	for( let group of groups ){

		output.push( {

			image: group.image,
			regions: group.regions.map( ( regionConfig ) => {
				
				let region = regions[ regionConfig.id ];

				return {
					colour: regionConfig.colour,
					id: region.id,
					name: region.name,
					markets: region.markets,
					value: {
						current: region.hvc_target_values.current,
						target: region.hvc_target_values.target,
						percentage: Math.min( Math.round( region.hvc_target_values.target_percentage ), 100 )
					},
					confirmedPercent: {
						hvc: region.confirmed_percent.hvc,
						nonHvc: region.confirmed_percent.non_hvc
					},
					hvcPerformance: {
						red: ( region.hvc_performance.red || 0 ),
						amber: ( region.hvc_performance.amber || 0 ),
						green: ( region.hvc_performance.green || 0 )
					}
				};
			} )
		} );
	}

	return output;
};
