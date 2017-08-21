
function combineData( data1, data2 ){

	return {
		number: {
			confirmed: ( data1.number.confirmed + data2.number.confirmed ),
			unconfirmed: ( data1.number.unconfirmed + data2.number.unconfirmed ),
			total: ( data1.number.total + data2.number.total )
		},
		value: {
			confirmed: ( data1.value.confirmed + data2.value.confirmed ),
			unconfirmed: ( data1.value.unconfirmed + data2.value.unconfirmed ),
			total: ( data1.value.total + data2.value.total )
		}
	};
}

function createConfirmedUnconfirmedPercentages( total, confirmed, unconfirmed ){

	const parts = ( 100 / total );

	return {
		confirmed: ( confirmed ? Math.round( parts * confirmed ) : 0 ),
		unconfirmed: ( unconfirmed ? Math.round( parts * unconfirmed ) : 0 )
	};
}

function createConfirmedUnconfirmedData( data ){

	const total = data.value.total;
	const confirmed = data.value.confirmed;
	const unconfirmed = data.value.unconfirmed;

	return createConfirmedUnconfirmedPercentages( total, confirmed, unconfirmed );
}

function createHvcNonHvcData( hvcWins, nonHvcWins ){

	let hvc = 0;
	let nonHvc = 0;

	const total = ( hvcWins.value.confirmed + nonHvcWins.value.confirmed );


	if( total > 0 ){

		const parts = ( 100 / total );

		hvc = Math.round( parts * hvcWins.value.confirmed );
		nonHvc = Math.round( parts * nonHvcWins.value.confirmed );
	}

	return { hvc, nonHvc	};
}

module.exports = {

	createConfirmedUnconfirmedPercentages,

	create: function( data ){

		if( data.wins.export.non_hvc ){

			const combinedData = combineData( data.wins.export.hvc, data.wins.export.non_hvc );

			return {
				hvcNonHvcValue: createHvcNonHvcData( data.wins.export.hvc, data.wins.export.non_hvc ),
				confirmedUnconfirmedValue: createConfirmedUnconfirmedData( combinedData )
			};

		} else {

			return {
				confirmedUnconfirmedValue: createConfirmedUnconfirmedData( data.wins.export.hvc )
			};
		}
	}
};
