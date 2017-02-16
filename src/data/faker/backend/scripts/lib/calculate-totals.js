module.exports = function calculateValues( data, keys ){

	for( let key of keys ){

		let totals = data[ key ];

		let num = totals.number;
		let val = totals.value;

		num.total = ( num.unconfirmed + num.confirmed );
		val.total = ( val.unconfirmed + val.confirmed );
	}
};
