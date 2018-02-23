const generateSchema = require( '../../../generate-schema' );

module.exports = function( year ){

	return generateSchema( '/investment/fdi/performance.schema', year );
};
