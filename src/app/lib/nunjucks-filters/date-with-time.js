const dateFormat = require( 'dateformat' );

module.exports = function( datestr ){

	let date;

	if( datestr ){

		date = new Date( datestr );
	
	} else {

		date = new Date();
	}

	return dateFormat( date, 'h:MMtt d mmmm yyyy' );
};
