module.exports = function calculatePercentages( data, keys ){

	for( let key of keys ){

		let info = data[ key ];

		info.unconfirmed_percent = ( 100 - info.confirmed_percent );
	}
};
