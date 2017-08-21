
function createGetPercent( target ){

	if( target > 0 ){

		const parts = ( 100 / target );

		return function getPercent( num ){

			let percent;
			let over = false;

			if( num > target ){

				percent = 100;
				over = true;

			} else {

				percent = Number( ( parts * num ).toFixed( 2 ) );
			}

			return {	percent, over };
		};

	} else {

		return () => ( { percent: 0, over: false } );
	}
}

module.exports = {

	create: function( target, confirmedValue, unconfirmedValue ){

		unconfirmedValue = ( confirmedValue + unconfirmedValue );

		const getPercent = createGetPercent( target );

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
