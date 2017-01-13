const logger = require( '../logger' );

const divideIconBy = 2.5;

const teamIcons = {

	1: [ 'financial-prof-serv.png', 120, 119 ],
	2: [ 'education.png', 120, 93 ],
	3: [ 'technology.png', 120, 102 ],
	4: [ 'food-drink.png', 120, 103 ],
	5: [ 'aerospace.png', 120, 120 ],
	6: [ 'infrastructure.png', 120, 115 ],
	7: [ 'energy.png', 120, 52 ],
	8: [ 'life-sciences.png', 120, 120 ],
	9: [ 'advanced-manufacturing.png', 120, 121 ],
	10: [ 'consumer-creative.png', 120, 119 ],
	11: [ 'automotive.png', 120, 59 ],
	12: [ 'healthcare.png', 120, 136 ],
	13: [ 'bio-economy.png', 120, 122 ],
	14: [ 'defence.png', 120, 161 ],
};

function getImage( team ){

	const icon = teamIcons[ team.id ];

	if( icon ){

		const [ name, width, height ] = icon;

		return {
			name,
			width: ( width / divideIconBy ),
			height: ( height / divideIconBy )
		};

	} else {

		logger.warn( 'No icon found for %s', team.id );
		return {};
	}
}

function mapValues( sector ){

	return {
		name: sector.name,
		hvcColours: sector.hvc_colours,
		value: {
			current: sector.hvc_target_values.current,
			target: sector.hvc_target_values.target,
			percentage: sector.hvc_target_values.target_percentage
		},
		hvcVsNonhvcPercentage: sector.hvc_vs_non_hvc_percentage
	};
}

module.exports = function( teams ){

	return teams.map( ( team ) => {

		let mappedTeam = mapValues( team );

		mappedTeam.image = getImage( team );
		mappedTeam.parentSectors = team.parent_sectors.map( mapValues );

		return mappedTeam;
	} );
};
