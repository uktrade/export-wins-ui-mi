const jsf = require( 'json-schema-faker' );

module.exports = function( path ){

	return jsf( require( '../../../../schema/backend' + path ) );
};
