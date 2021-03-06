const dateFormat = require( 'dateformat' );

const formatStr = 'UTC:d mmmm yyyy';

module.exports = function( datestr ){

	if( datestr ){

		try {

			return dateFormat( new Date( datestr ), formatStr );

		} catch( e ){

			return '';
		}

	} else {

		return dateFormat( new Date(), formatStr );
	}
};
