
function combineData( data1, data2 ){

	return {
		number: {
			confirmed: ( data1.number.confirmed + data2.number.confirmed ),
			non_confirmed: ( data1.number.non_confirmed + data2.number.non_confirmed ),
			total: ( data1.number.total + data2.number.total )
		},
		value: {
			confirmed: ( data1.value.confirmed + data2.value.confirmed ),
			non_confirmed: ( data1.value.non_confirmed + data2.value.non_confirmed ),
			total: ( data1.value.total + data2.value.total )
		}
	};
}


function createConfirmedUnconfirmedData( data ){

	const parts = ( 100 / data.value.total );

	return {
		confirmed: Math.round( parts * data.value.confirmed ),
		unconfirmed: Math.round( parts * data.value.non_confirmed )
	};
}

function createHvcNonHvcData( hvc, nonHvc ){

	const total = ( hvc.value.confirmed + nonHvc.value.confirmed );
	const parts = ( 100 / total );

	return {
		hvc: Math.round( parts * hvc.value.confirmed ),
		nonHvc: Math.round( parts * nonHvc.value.confirmed )
	};
}

module.exports = {

	create: function( data ){

		const combinedData = combineData( data.wins.hvc, data.wins.non_hvc );

		return {
			hvcNonHvcValue: createHvcNonHvcData( data.wins.hvc, data.wins.non_hvc ),
			confirmedUnconfirmedValue: createConfirmedUnconfirmedData( combinedData )
		};
	}
};
