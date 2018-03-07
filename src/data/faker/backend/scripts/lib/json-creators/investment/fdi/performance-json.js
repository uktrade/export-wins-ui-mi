const generateSchema = require( '../../../generate-schema' );

module.exports = {

	index: function( year ){

		return generateSchema( '/investment/fdi/performance/index.schema', year );
	},

	tab: function( year ){

		return generateSchema( '/investment/fdi/performance/tab.schema', year );
	}
};
