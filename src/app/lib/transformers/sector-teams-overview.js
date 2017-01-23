const logger = require( '../logger' );

const divideIconBy = 2.5;

const teamIcons = {

	/* use full path to image for usemin to do it's thing */
	1: [ '/public/img/sector-team-icons/financial-prof-serv.png', 120, 119 ],
	2: [ '/public/img/sector-team-icons/education.png', 120, 93 ],
	3: [ '/public/img/sector-team-icons/technology.png', 120, 102 ],
	4: [ '/public/img/sector-team-icons/food-drink.png', 120, 103 ],
	5: [ '/public/img/sector-team-icons/aerospace.png', 120, 120 ],
	6: [ '/public/img/sector-team-icons/infrastructure.png', 120, 115 ],
	7: [ '/public/img/sector-team-icons/energy.png', 120, 52 ],
	8: [ '/public/img/sector-team-icons/life-sciences.png', 120, 120 ],
	9: [ '/public/img/sector-team-icons/advanced-manufacturing.png', 120, 121 ],
	10: [ '/public/img/sector-team-icons/consumer-creative.png', 120, 119 ],
	11: [ '/public/img/sector-team-icons/automotive.png', 120, 59 ],
	12: [ '/public/img/sector-team-icons/healthcare.png', 120, 136 ],
	13: [ '/public/img/sector-team-icons/bio-economy.png', 120, 122 ],
	14: [ '/public/img/sector-team-icons/defence.png', 120, 61 ],
};

function getImage( team ){

	const icon = teamIcons[ team.id ];

	if( icon ){

		const [ url, width, height ] = icon;

		return {
			url,
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
		id: sector.id,
		name: sector.name,
		hvcColours: {
			red: ( sector.hvc_colours.red || 0 ),
			amber: ( sector.hvc_colours.amber || 0 ),
			green: ( sector.hvc_colours.green || 0 )
		},
		value: {
			current: sector.hvc_target_values.current,
			target: sector.hvc_target_values.target,
			percentage: Math.min( Math.round( sector.hvc_target_values.target_percentage ), 100 )
		},
		hvcVsNonhvcPercentage: Math.round( sector.hvc_vs_non_hvc_percentage )
	};
}

module.exports = function( teams ){

	return teams.map( ( team ) => {

		let mappedTeam = mapValues( team );

		mappedTeam.image = getImage( team );
		mappedTeam.hvcGroups = team.parent_sectors.map( mapValues );

		return mappedTeam;
	} );
};
