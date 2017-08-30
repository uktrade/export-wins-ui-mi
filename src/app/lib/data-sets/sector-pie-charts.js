function createPercentage( total, inputA, inputB ){

	let a = 0;
	let b = 0;

	if( total > 0 ){

		const parts = ( 100 / total );

		a = Math.round( parts * inputA );
		b = Math.round( parts * inputB );
	}

	return [ a, b ];
}

function confirmedUnconfirmedPercentages( total, confirmed, unconfirmed ){

	const output = createPercentage( total, confirmed, unconfirmed );

	return {
		confirmed: output[ 0 ],
		unconfirmed: output[ 1 ]
	};
}

function hvcNonHvcPercentages( confirmedHvcWins, confirmedNonHvcWins ){

	const output = createPercentage( ( confirmedHvcWins + confirmedNonHvcWins ),  confirmedHvcWins, confirmedNonHvcWins );

	return {
		hvc: output[ 0 ],
		nonHvc: output[ 1 ]
	};
}

module.exports = {

	createConfirmedUnconfirmedPercentages: confirmedUnconfirmedPercentages,

	//Value
	create: function( data ){

		const exportData = data.wins.export;

		if( exportData.non_hvc ){

			return {
				hvcNonHvcValue: hvcNonHvcPercentages( exportData.hvc.value.confirmed, exportData.non_hvc.value.confirmed ),
				confirmedUnconfirmedValue: confirmedUnconfirmedPercentages( exportData.totals.value.grand_total, exportData.totals.value.confirmed, exportData.totals.value.unconfirmed )
			};

		} else {

			return {
				confirmedUnconfirmedValue: confirmedUnconfirmedPercentages( exportData.hvc.value.total, exportData.hvc.value.confirmed, exportData.hvc.value.unconfirmed )
			};
		}
	},

	//Volume
	createForNumber: function( data ){

		const exportData = data.wins.export;

		if( exportData.non_hvc ){

			return {
				hvcNonHvcValue: hvcNonHvcPercentages( exportData.hvc.number.confirmed, exportData.non_hvc.number.confirmed ),
				confirmedUnconfirmedValue: confirmedUnconfirmedPercentages( exportData.totals.number.grand_total, exportData.totals.number.confirmed, exportData.totals.number.unconfirmed )
			};

		} else {

			return {
				confirmedUnconfirmedValue: confirmedUnconfirmedPercentages( exportData.hvc.number.total, exportData.hvc.number.confirmed, exportData.hvc.number.unconfirmed )
			};
		}
	}
};
