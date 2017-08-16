const normalise = require( 'normalize-strings' );

module.exports = function( results ){

	const list = {};

	for( let i = 65; i <= 90; i++ ){

		list[ String.fromCharCode( i ) ] = [];
	}

	for( let country of results ){

		const firstChar = normalise( country.name.charAt( 0 ) ).toUpperCase();

		list[ firstChar ].push( country );
	}

	return list;
};
