const generateSchema = require( '../../../generate-schema' );

module.exports = {

	createOverview: function( year ){

		return generateSchema( '/investment/fdi/overview.schema', year );
	},

	createOverviewYoy: function( year ){

		return generateSchema( '/investment/fdi/overview-yoy.schema', year );
	}
};
