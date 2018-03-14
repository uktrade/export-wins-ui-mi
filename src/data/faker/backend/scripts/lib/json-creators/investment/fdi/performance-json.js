const generateSchema = require( '../../../generate-schema' );

module.exports = {

	index: function( year ){

		return generateSchema( '/investment/fdi/performance/index.schema', year );
	},

	detail: function( year ){

		return generateSchema( '/investment/fdi/performance/detail.schema', year );
	}
};
