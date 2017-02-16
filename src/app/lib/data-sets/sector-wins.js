
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


function createConfirmedUnconfirmedData( data ){

	const parts = ( 100 / data.value.total );

	return {
		confirmed: ( data.value.confirmed ? Math.round( parts * data.value.confirmed ) : 0 ),
		unconfirmed: (  data.value.unconfirmed ? Math.round( parts * data.value.unconfirmed ) : 0 )
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
