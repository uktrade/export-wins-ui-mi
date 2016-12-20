
module.exports = {

	create: function( winsData ){

		const target = winsData.hvcs.target;
		const confirmed = winsData.wins.hvc.value.confirmed;
		let progress;

		if( confirmed > target ){

			progress = 100;

		} else {

			const parts = ( 100 / target );
			progress = ( parts * confirmed );
		}

		return {
			percent: Number( progress.toFixed( 2 ) ),
			gauge: Number( ( ( progress / 2 ) / 100 ).toFixed( 2 ) )
		};
	}
};
