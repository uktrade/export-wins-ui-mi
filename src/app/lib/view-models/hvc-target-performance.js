
const highestPercent = 125;
const percentParts = ( 100 / highestPercent );

function calculatePercent( num ){

	return ( percentParts * num );
}

function calculateTarget( item ){

	let confirmedPercent = item.progress.confirmed;
	let unconfirmedPercent = item.progress.unconfirmed;

	let confirmed;
	let unconfirmed;
	let overThreshold = false;

	if( confirmedPercent > highestPercent ){

		confirmed = 100;
		unconfirmed = 0;
		overThreshold = true;

	} else if( unconfirmedPercent > highestPercent ){

		confirmed = calculatePercent( confirmedPercent );
		unconfirmed= ( 100 - confirmed );
		overThreshold = true;

	} else if( ( confirmedPercent + unconfirmedPercent ) > highestPercent ){

		confirmed = calculatePercent( confirmedPercent );
		unconfirmed = ( 100 - confirmed );
		overThreshold = true;

	} else {

		confirmed = calculatePercent( confirmedPercent );
		unconfirmed = calculatePercent( unconfirmedPercent );
	}

	item.progress = {
		target: {
			confirmed: Math.round( confirmed ),
			unconfirmed: Math.round( unconfirmed ),
			overThreshold
		},
		confirmed: confirmedPercent,
		unconfirmed: unconfirmedPercent
	};
}

module.exports = {

	create: function( data ){

		let output = {
			zeroTarget: [],
			withTarget: []
		};

		if( data ){

			data.forEach( function( item ){

				if( item.target > 0 ){

					//clone the item to prevent updating the original (issue when this is a stub in memory)
					let newItem = Object.create( item );
					calculateTarget( newItem );
					output.withTarget.push( newItem );

				} else {

					output.zeroTarget.push( item );
				}
			} );
		}
		
		return output;
	}
};
