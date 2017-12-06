const dateFormat = require( 'dateformat' );

function isValid( datestr ){

	return ( typeof datestr === 'number' ) || !!Date.parse( datestr );
}

module.exports = function( datestr ){

	if( datestr && isValid( datestr ) ){

		return dateFormat( new Date( datestr ), 'UTC:dd-mm-yyyy' );

	} else {

		return '';
	}
};
