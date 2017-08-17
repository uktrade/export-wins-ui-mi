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

		mappedTeam.totalHvcs = countHvcs( mappedTeam );
		mappedTeam.hvcGroups = team.hvc_groups.map( ( group ) => mapValues( group, 'HVCs' ) );

		return mappedTeam;
	} );
};
