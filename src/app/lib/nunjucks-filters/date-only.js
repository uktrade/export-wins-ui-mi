const dateFormat = require( 'dateformat' );

module.exports = function( datestr ){

	let date;

	if( datestr ){

		date = new Date( datestr );

	} else {

		date = new Date();
	}

	//return date.getMonth() date.getFullYear();
	return dateFormat( date, 'UTC:d mmmm yyyy' );
};
