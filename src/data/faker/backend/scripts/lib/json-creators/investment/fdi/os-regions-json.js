const generateSchema = require( '../../../generate-schema' );

module.exports = {

	createIndex: function( year ){

		return generateSchema( '/investment/fdi/os_regions/index.schema', year );
	}
};
