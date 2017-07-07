
module.exports = {

	create: function( target, confirmedValue, unconfirmedValue ){

		const parts = ( 100 / target );

		unconfirmedValue = ( confirmedValue + unconfirmedValue );

		function getPercent( num ){

			let percent;
			let over = false;

			if( num > target ){

				percent = 100;
				over = true;

			} else {

				percent = Number( ( parts * num ).toFixed( 2 ) );
			}

			return {	percent, over };
		}

		const confirmed = getPercent( confirmedValue );
		const unconfirmed = getPercent( unconfirmedValue );
		const over = ( confirmed.over || unconfirmed.over );
		const overModifyer = ( over ? ( confirmed.over ? 'confirmed' :  'unconfirmed' ) : null );

		return {
			confirmed: confirmed.percent,
			unconfirmed: unconfirmed.percent,
			over,
			overModifyer
		};
	}
};
