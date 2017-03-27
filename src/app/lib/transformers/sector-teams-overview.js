const logger = require( '../logger' );

const divideIconBy = 3;

const teamIcons = {

	/* use full path to image for usemin to do it's thing */
	1: [ '/public/img/sector-team-icons/financial-prof-serv.png', 120, 120 ],
	2: [ '/public/img/sector-team-icons/education.png', 120, 93 ],
	3: [ '/public/img/sector-team-icons/technology.png', 120, 102 ],
	4: [ '/public/img/sector-team-icons/food-drink.png', 120, 103 ],
	5: [ '/public/img/sector-team-icons/aerospace.png', 120, 120 ],
	6: [ '/public/img/sector-team-icons/infrastructure.png', 120, 120 ],
	7: [ '/public/img/sector-team-icons/energy.png', 120, 52 ],
	8: [ '/public/img/sector-team-icons/life-sciences.png', 120, 120 ],
	9: [ '/public/img/sector-team-icons/advanced-manufacturing.png', 120, 120 ],
	10: [ '/public/img/sector-team-icons/consumer-creative.png', 120, 120 ],
	11: [ '/public/img/sector-team-icons/automotive.png', 120, 59 ],
	12: [ '/public/img/sector-team-icons/healthcare.png', 120, 120 ],
	13: [ '/public/img/sector-team-icons/bio-economy.png', 120, 120 ],
	14: [ '/public/img/sector-team-icons/defence.png', 120, 113 ],
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

function countHvcs( team ){

	const hvcs = team.hvcPerformance;

	return ( hvcs.red + hvcs.amber + hvcs.green + hvcs.zero );
}

function createTargetPercent( percentage ){
	return {
		capped: Math.min( percentage, 100 ),
		isOver: ( percentage > 100 ),
		value: percentage
	};
}

function mapValues( sector, nameSuffix ){

	const hvcValues = sector.values.hvc;
	const nonHvcValues = sector.values.non_hvc;

	let r = {
		id: sector.id,
		name: ( sector.name + ' ' + nameSuffix ),
		hvcPerformance: {
			red: ( sector.hvc_performance.red || 0 ),
			amber: ( sector.hvc_performance.amber || 0 ),
			green: ( sector.hvc_performance.green || 0 ),
			zero: ( sector.hvc_performance.zero || 0 )
		}
	};

	let values = {
		hvc: {
			target: hvcValues.target,
			current: hvcValues.current,
			targetPercent: {
				confirmed: createTargetPercent( hvcValues.target_percent.confirmed ),
				unconfirmed: createTargetPercent( hvcValues.target_percent.unconfirmed ) 
			}
		}
	};

	if( nonHvcValues ){

		values.nonHvc = {
			current: nonHvcValues.current
		};

		r.confirmedPercent = {
			hvc: hvcValues.total_win_percent.confirmed,
			nonHvc: nonHvcValues.total_win_percent.confirmed
		};
	}

	if( sector.values.totals ){

		values.totals = sector.values.totals;
	}

	r.values = values;

	return r;
}

module.exports = function( teams ){

	return teams.map( ( team ) => {

		let mappedTeam = mapValues( team, 'Sector Team' );

		mappedTeam.image = getImage( team );
		mappedTeam.totalHvcs = countHvcs( mappedTeam );
		mappedTeam.hvcGroups = team.hvc_groups.map( ( group ) => mapValues( group, 'HVCs' ) );

		return mappedTeam;
	} );
};
