module.exports = function calculateTotals( data, objKeys, valueKeys = [ 'number', 'value' ] ){

	for( let objKey of objKeys ){

		const obj = data[ objKey ];

		for( let valueKey of valueKeys ){

			const item = obj[ valueKey ];

			item.total = ( item.confirmed + item.unconfirmed );
		}
	}
};
