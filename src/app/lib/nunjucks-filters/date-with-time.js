const dateFormat = require( 'dateformat' );

function isValid( datestr ){

	return ( typeof datestr === 'number' ) || !!Date.parse( datestr );
}

module.exports = function( datestr, maxDate ){

	let date;

	if( datestr && isValid( datestr ) ){

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

	return dateFormat( date, 'GMT:h:MMtt d mmmm yyyy Z' );
};
