const jsf = require( 'json-schema-faker' );

module.exports = {

	createTable: function(){
		
		return jsf( require( '../../../schema/mocks/hvc-table' ) );
	}
};
