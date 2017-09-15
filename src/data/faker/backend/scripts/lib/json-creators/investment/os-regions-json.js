const generateSchema = require( '../../generate-schema' );

module.exports = {

	createIndex: function( year ){

		return generateSchema( '/investment/os_regions/index.schema', year );
	}
};
