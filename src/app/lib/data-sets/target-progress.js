
function createGetPercent( target ){

	if( target > 0 ){

		const parts = ( 100 / target );

		return function getPercent( num ){

			const percent = Math.round( ( parts * num ).toFixed( 2 ) );
			const over = ( num > target );
			const capped = ( over ? 100 : percent );

			return { capped, percent, over };
		};

	} else {

		return () => ( { capped: 0, percent: 0, over: false } );
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
			confirmed,
			unconfirmed,
			over,
			overModifyer
		};
	}
};
