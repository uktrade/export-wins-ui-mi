const dateFormat = require( 'dateformat' );

module.exports = function( datestr, maxDate ){

	let date;

	if( datestr ){

		date = new Date( datestr );

	} else {

		date = new Date();
	}

	if( maxDate ){

		let mDate = new Date( maxDate );

		if( date > mDate ){

			date = mDate;
		}
	}

	return dateFormat( date, 'UTC:h:MMtt d mmmm yyyy' );
};
