const dateFormat = require( 'dateformat' );

module.exports = function( datestr ){

	if( datestr ){

		return dateFormat( new Date( datestr ), 'UTC:dd-mm-yyyy' );

	} else {

		return '';
	}
};