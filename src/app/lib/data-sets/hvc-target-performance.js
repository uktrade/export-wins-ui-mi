
const highestPercent = 125;
const percentParts = ( 100 / highestPercent );

function calculatePercent( num ){

	return ( percentParts * num );
}

module.exports = {

	create: function( data ){

		return data.map( function( item ){

			let confirmedPercent = item.progress.confirmed;
			let unconfirmedPercent = item.progress.unconfirmed;
			let confirmed;
			let unconfirmed;
			let overThreshold = false;
			//clone the item to prevent updating the original (issue when this is a stub in memory)
			let newItem = Object.create( item );

			if( confirmedPercent > highestPercent ){

				confirmed = 100;
				unconfirmed = 0;
				overThreshold = true;

			} else if( unconfirmedPercent > highestPercent ){

				confirmed = 0;
				unconfirmed = 100;
				overThreshold = true;

			} else if( ( confirmedPercent + unconfirmedPercent ) > highestPercent ){

				confirmed = calculatePercent( confirmedPercent );
				unconfirmed = ( 100 - confirmed );
				overThreshold = true;

			} else {

				confirmed = calculatePercent( confirmedPercent );
				unconfirmed = calculatePercent( unconfirmedPercent );
			}

			newItem.progress = {
				confirmed,
				unconfirmed,
				overThreshold
			};

			return newItem;
		} );
	}
};
