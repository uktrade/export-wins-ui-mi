const dateFormat = require( 'dateformat' );

module.exports = function( datestr ){

	if( datestr ){

		try {

			return dateFormat( new Date( datestr ), 'UTC:d mmmm yyyy' );

		} catch( e ){

			return '';
		}

	} else {

		return '';
	}
};
